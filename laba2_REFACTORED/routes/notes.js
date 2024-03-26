var express = require('express');
var router = express.Router();

const Notes = require('../models/index').Notes;

router.get('/', function (req, res, next) {
    if(req.session.authenticated){
        Notes.findAll({
            where: {
                userid: req.session.user.id
            }
        }).then(notes => {
            res.render('notes', { notes: notes, navbar: res.locals.navbar, session: req.session, message: req.flash(), messages: res.locals.messages});
        })
    } else{
        req.flash('warning', 'Login first to see notes');
        res.redirect('/auth/login');
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

module.exports = router;
