var express = require('express');
var jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
var auth = require('../auth');
var router = express.Router();

const Students = require('../models/index').Students;
const Notes = require('../models/index').Notes;

router.get('/generate', function (req, res, next) {
    const user = req.session.user;
    const token = auth.generateAccessToken({ login: user.login, id: user.id });
    if (token) {
        req.flash('success', 'Token generated successfully');
        res.render('token', { token: token, session: req.session, message: req.flash(), messages: res.locals.messages, navbar: res.locals.navbar });
    } else {
        req.flash('error', 'Error occured, try again later');
        res.redirect('/notes');
    }
});


router.get('/students', function (req, res, next) {
    Students.findAll().then(students => {
        res.json(students);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
    });
});



router.get('/students/:id', function (req, res, next) {
    Students.findOne({ where: { id: req.params.id } }).then(student => {
        if (student) {
            res.json(student);
        } else {
            res.status(404).send('Student not found');
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
    });
});

router.get('/notes/page/:page', auth.authenticateToken, function (req, res, next) {
        const {  limit =10, filter } = req.query;
        const page = parseInt(req.params.page);
        var whereClause = {
            userid: req.user.id
        };
        if (filter) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${filter}%` } },
                { text: { [Op.like]: `%${filter}%` } }
            ];
        }
        const offset = (page - 1) * limit;
        Notes.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: offset
        }).then(notes => {
            const totalPages = Math.ceil(notes.count / limit);
            res.json({ notes: notes.rows, totalPages: totalPages });
        }).catch(err => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
});


router.get('/notes', function (req, res, next) {
    jwt.verify(req.headers.token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).send('Forbidden');
        } else {
            console.log(user);
            Notes.findAll({
                where: {
                    userid: user.id
                }
            }).then(notes => {
                res.json(notes);
            }).catch(err => {
                console.error(err);
                res.status(500).send('Internal server error');
            });
        }
    });
});

router.get('/notes/:id', function (req, res, next) {
    jwt.verify(req.headers.token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).send('Forbidden');
        } else {
            Notes.findOne({ where: { id: req.params.id } }).then(note => {
                if (note && note.userid == user.id) {
                    res.json(note);
                } else {
                    res.status(404).send('Note not found');
                }
            }).catch(err => {
                console.error(err);
                res.status(500).send('Internal server error');
            });
        }
    });
});

router.post('/notes', function (req, res, next) {
    jwt.verify(req.headers.token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).send('Forbidden');
        } else {
            Notes.create({
                title: req.body.title,
                text: req.body.text,
                userid: user.id
            }).then(note => {
                res.json(note);
            }).catch(err => {
                console.error(err);
                res.status(500).send('Internal server error');
            });
        }
    });
});

router.put('/notes/:id', function (req, res, next) {
    jwt.verify(req.headers.token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).send('Forbidden');
        } else {
            Notes.findOne({ where: { id: req.params.id } }).then(note => {
                if (note && note.userid == user.id) {
                    note.update({
                        title: req.body.title,
                        text: req.body.text
                    }).then(note => {
                        res.json(note);
                    }).catch(err => {
                        console.error(err);
                        res.status(500).send('Internal server error');
                    });
                } else {
                    res.status(404).send('Note not found');
                }
            }).catch(err => {
                console.error(err);
                res.status(500).send('Internal server error');
            });
        }
    });
});

router.delete('/notes/:id', function (req, res, next) {
    jwt.verify(req.headers.token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).send('Forbidden');
        } else {
            Notes.findOne({ where: { id: req.params.id } }).then(note => {
                if (note && note.userid == user.id) {
                    note.destroy().then(() => {
                        res.status(204).send('Note deleted successfully');
                    }).catch(err => {
                        console.error(err);
                        res.status(500).send('Internal server error');
                    });
                } else {
                    res.status(404).send('Note not found');
                }
            }).catch(err => {
                console.error(err);
                res.status(500).send('Internal server error');
            });
        }
    });
});

module.exports = router;
