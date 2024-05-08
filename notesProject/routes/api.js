const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const auth = require('../auth')
const router = express.Router();

const Students = require('../models/index').Students;
const Notes = require('../models/index').Notes;

router.get('/generate', function (req, res, next) {
    const user = req.session.user;
    const token = auth.generateAccessToken({ login: user.login, id: user.id });

    if (!token) {
        req.flash('error', 'Error occured, try again later');
        return res.redirect('/notes');
    }

    req.flash('success', 'Token generated successfully');
    res.render('token', { token: token, session: req.session, message: req.flash(), messages: res.locals.messages, navbar: res.locals.navbar });
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

        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.json(student);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
    });
});

router.get('/notes/page/:page', auth.authenticateToken, function (req, res, next) {
        const { limit = 10, filter } = req.query;
        const page = parseInt(req.params.page);

        if (isNaN(page) || !Number.isInteger(page)) {
            return res.status(400).json({ error: 'Page parameter must be an integer.' });
        }

        const whereClause = {
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
    jwt.verify(req.headers.token, auth.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }

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
    });
});

router.get('/notes/:id', function (req, res, next) {
    jwt.verify(req.headers.token, auth.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }

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
    });
});

router.post('/notes', function (req, res, next) {
    jwt.verify(req.headers.token, auth.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }

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
    });
});

router.put('/notes/:id', function (req, res, next) {
    jwt.verify(req.headers.token, auth.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }

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
    });
});

router.delete('/notes/:id', function (req, res, next) {
    jwt.verify(req.headers.token, auth.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }

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
    });
});

module.exports = router;