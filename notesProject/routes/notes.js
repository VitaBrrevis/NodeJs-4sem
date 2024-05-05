var express = require('express');
var router = express.Router();

const Notes = require('../models/index').Notes;
const Users = require('../models/index').Users;

router.get('/', async (req, res, next) => {
    try {
        if(req.session.authenticated){
            const { limit = 7, page = 1,  filter } = req.query;
            const offset = (page - 1) * limit;

            // const whereClause = {
            //     userid: req.session.user.id
            // };

            // Apply filtering if filter query parameter is present
            // if (filter) {
            //     whereClause[Op.or] = [
            //         { title: { [Op.like]: `%${filter}%` } },
            //         { text: { [Op.like]: `%${filter}%` } }
            //     ];
            // }

            // const { count, rows: notes } = await Notes.findAndCountAll({
            //     where: whereClause,
            //     offset,
            //     limit: parseInt(limit)
            // });
            var request = `http://localhost:3000/api/v1/notes/page/${parseInt(page)}?limit=${limit}`;
            request += filter == null ? "" : `&filter=${filter}`;
            notesRes = await fetch( request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': `token=${req.cookies.token}`
                    }

                });
            const {notes,totalPages} = await (notesRes).json();


            //const totalPages = Math.ceil(count / limit);

            res.render('notes', {
                notes: notes,
                navbar: res.locals.navbar,
                session: req.session,
                message: req.flash(),
                messages: res.locals.messages,
                totalPages,
                currentPage: page,
                filter
            });
        } else {
            req.flash('warning', 'Login first to see notes');
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.error(error);
        req.flash('error', 'Internal server error');
        res.redirect('/notes');
    }
});


router.post('/', async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const t = await Notes.sequelize.transaction();
    try {
        await Notes.create({title: title, text: content, userid: req.session.user.id}, {transaction: t})
        await t.commit();
        req.flash('success', 'Note added successfully');
        res.redirect('/notes');
    }catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
router.get('/delete/:id', (req, res) => {
    Notes.findOne({ where: { id: req.params.id } })
        .then(note => {
            if (note.userid != req.session.user.id) {
                req.flash('warning', 'You don\'t have permission to delete this note');
                res.redirect('/notes');
            } else {
                note.destroy();
                req.flash('success', 'Note deleted successfully');
                res.redirect('/notes');
            }
        }).catch(err => {
        console.error(err);
        req.flash('error', 'Error occured, try again later');
        res.redirect('/notes');
    });
});

router.get('/change/:id', (req, res) => {
    Notes.findOne({ where: { id: req.params.id } })
        .then(note => {
            if (note.userid != req.session.user.id) {
                req.flash('warning', 'You don\'t have permission to change this note');
                res.redirect('/notes');
            } else {
                res.render('changeNote', { note: note, navbar: res.locals.navbar, session: req.session });
            }
        }).catch(err => {
        console.error(err);
        req.flash('error', 'Error occured, try again later');
        res.redirect('/notes');
    });
});

router.post('/change/:id', async(req, res) => {
    const t = await Notes.sequelize.transaction();
    try {
    Notes.update({
        title: req.body.title,
        text: req.body.content
    }, {
        where: {
            id: req.params.id
        }
    }, {transaction: t});
        await t.commit();
        req.flash('success', 'Note updated successfully');
        res.redirect('/notes');

    }catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.post('/share/:id', async (req, res) => {
    Notes.findOne({ where: { id: req.params.id } })
        .then(note => {
            if (note.userid != req.session.user.id) {
                req.flash('warning', 'You don\'t have permission to share this note');
                res.redirect('/notes');
            } else if (req.body.email === req.session.user.login) {
                req.flash('warning', 'You you can\'t share note with yourself');
                res.redirect('/notes');
            } else {
                Users.findOne({ where: { login: req.body.email } }).
                then(async (user) => {
                    if (user == null) {
                        req.flash('warning', 'User with this email doesn\'t exist');
                        res.redirect('/notes');
                    } else {
                        let sharedNotes = user.sharednotes ? user.sharednotes.split(',') : [];
                        if (sharedNotes.includes(note.id.toString())) {
                            req.flash('warning', 'Note already shared with this user');
                            res.redirect('/notes');
                            return;
                        }
                        sharedNotes.push(note.id);
                        const t = await Users.sequelize.transaction();
                        try {
                            user.update({sharednotes: sharedNotes.join(',')}, {transaction: t});
                            await t.commit();
                            req.flash('success', 'Note shared successfully');
                            res.redirect('/notes');
                        }catch (error) {
                            await t.rollback();
                            console.error(error);
                            res.status(500).send('Internal server error');
                        }
                    }
                }).catch(err => {
                    console.error(err);
                    req.flash('error', 'Error occured, try again later');
                    res.redirect('/notes');
                });
            }
        }).catch(err => {
        console.error(err);
        req.flash('error', 'Error occured, try again later');
        res.redirect('/notes');
    });
});

router.get('/sharednotes', (req, res) => {
    if(req.session.authenticated){
        let sharedNotes = req.session.user.sharednotes;
        if (sharedNotes) {
            sharedNotes = sharedNotes.split(',');
            Notes.findAll({
                where: {
                    id: sharedNotes
                }
            }).then(notes => {
                const userPromises = notes.map(note => {
                    return Users.findOne({
                        where: { id: note.userid }
                    }).then(user => {
                        note.dataValues.login = user.login;
                        note.dataValues.name = user.name;
                        note.dataValues.surname = user.surname;
                        return note;
                    });
                });

                Promise.all(userPromises).then(completedNotes => {
                    res.render('sharedNotes', { notes: completedNotes, navbar: res.locals.navbar, session: req.session, message: req.flash(), messages: res.locals.messages });
                });
            });
        } else {
            req.flash('info', 'No shared notes');
            res.redirect('/notes');
        }
    } else{
        req.flash('warning', 'Login first to see shared notes');
        res.redirect('/auth/login');
    }
});

module.exports = router;