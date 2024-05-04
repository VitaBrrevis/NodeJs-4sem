const express = require('express');
const router = express.Router();

const Notes = require('../models/index').Notes;
const Users = require('../models/index').Users;
const findNote = require('../services/notes/findNote');

router.get('/', async (req, res, next) => {
    try {

        if (!req.session.authenticated) {
            req.flash('warning', 'Login first to see notes');
            return res.redirect('/auth/login');
        }

        if (req.query.limit && !Number.isInteger(Number(req.query.limit))) {
            req.flash('error', 'Limit should be an integer');
            return res.redirect('/notes');
        }
        
        if (req.query.page && !Number.isInteger(Number(req.query.page))) {
            req.flash('error', 'Page should be an integer');
            return res.redirect('/notes');
        }

        const { limit = 7, page = 1, filter } = req.query;
        const requestUrl = `http://localhost:3000/api/v1/notes/page/${parseInt(page)}?limit=${limit}${filter ? `&filter=${filter}` : ''}`;

        const notesRes = await fetch(requestUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${req.cookies.token}`
            }
        });

        if (!notesRes.ok) {
            throw new Error(`Failed to fetch notes: ${notesRes.statusText}`);
        }

        const { notes, totalPages } = await notesRes.json();

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
    } catch (error) {
        console.error(error);
        req.flash('error', 'Internal server error');
        res.redirect('/notes');
    }
});


router.post('/', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    Notes.create({ title: title, text: content, userid: req.session.user.id })
        .then(() => {
            req.flash('success', 'Note added successfully');
            res.redirect('/notes');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
});

router.get('/delete/:id', async (req, res) => {
    const note = await findNote(req, res, req.params.id, 'delete');
    if (!note) return;

    note.destroy();
    req.flash('success', 'Note deleted successfully');
    res.redirect('/notes');
});

router.get('/change/:id', async (req, res) => {
    const note = await findNote(req, res, req.params.id, 'change');
    if (!note) return;

    res.render('changeNote', { note, navbar: res.locals.navbar, session: req.session });
});

router.post('/change/:id', async (req, res) => {
    const note = await findNote(req, res, req.params.id, 'change');
    if (!note) return;

    await Notes.update({
        title: req.body.title,
        text: req.body.content 
    }, {
        where: { id: req.params.id }
    });

    req.flash('success', 'Note updated successfully');
    res.redirect('/notes');
});

router.post('/change/:id', (req, res) => {
    Notes.update({
        title: req.body.title,
        text: req.body.content 
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        req.flash('success', 'Note updated successfully');
        res.redirect('/notes');
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
    });
});

router.post('/share/:id', async (req, res) => {
    try {
        const note = await findNote(req, res, req.params.id, 'share');

        if (!note) {
            req.flash('warning', 'You don\'t have permission to share this note');
            return res.redirect('/notes');
        }

        if (!note) {
            req.flash('warning', 'Note not found');
            return res.redirect('/notes');
        }

        if (req.body.email === req.session.user.login) {
            req.flash('warning', 'You can\'t share note with yourself');
            return res.redirect('/notes');
        }

        const user = await Users.findOne({ where: { login: req.body.email } });
        if (!user) {
            req.flash('warning', 'User with this email doesn\'t exist');
            return res.redirect('/notes');
        }

        let sharedNotes = user.sharednotes ? user.sharednotes.split(',') : [];
        if (sharedNotes.includes(note.id.toString())) {
            req.flash('warning', 'Note already shared with this user');
            return res.redirect('/notes');
        }

        sharedNotes.push(note.id);
        await user.update({ sharednotes: sharedNotes.join(',') });
        req.flash('success', 'Note shared successfully');
        res.redirect('/notes');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error occurred, try again later');
        res.redirect('/notes');
    }
});

router.get('/sharednotes', async (req, res) => {
    try {
        if (!req.session.authenticated) {
            req.flash('warning', 'Login first to see shared notes');
            return res.redirect('/auth/login');
        }

        let sharedNotes = req.session.user.sharednotes;
        if (!sharedNotes) {
            req.flash('info', 'No shared notes');
            return res.redirect('/notes');
        }

        sharedNotes = sharedNotes.split(',');
        const notes = await Notes.findAll({ where: { id: sharedNotes } });

        const userPromises = notes.map(async (note) => {
            const user = await Users.findOne({ where: { id: note.userid } });
            note.dataValues.login = user.login;
            note.dataValues.name = user.name;
            note.dataValues.surname = user.surname;
            return note;
        });

        const completedNotes = await Promise.all(userPromises);
        res.render('sharedNotes', { notes: completedNotes, navbar: res.locals.navbar, session: req.session, message: req.flash(), messages: res.locals.messages });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Internal server error');
        res.redirect('/notes');
    }
});

module.exports = router;
