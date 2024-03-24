var express = require('express');
var router = express.Router();

const Users = require('../models/index').Users;

router.get('/signup', function (req, res, next) {
    if (req.session.authenticated) {
        res.redirect('/');
    } else{
        res.render('signup', { message: res.locals.message });
    }
});

router.post('/signup', function(req, res, next) {
    Users.findOne({
        where: {
            login: req.body.username
        }
    }).then(user => {
        if (user) {
            console.log('User already exists');
            res.locals.message = 'User already exists with this login';
            res.redirect('/auth/signup');
        } else if (req.body.password
        .toLowerCase()
        .match(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )) {
            console.log('Passwords do not match');
            res.locals.message = 'Passwords do not match';
            res.redirect('/auth/signup');
        } else {
            Users.create({
                login: req.body.username,
                password: req.body.password,
                name: req.body.firstname,
                surname: req.body.secondname,
                phone: req.body.phone
            }).then(user => {
                res.redirect('/auth/login');
            }).catch(err => {
                console.error(err);
                res.status(500).send('Internal server error');
            });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
    });

});

router.get('/login', function (req, res, next) {
    if (req.session.authenticated) {
        res.redirect('/');
    } else{
        res.render('login');
    }
});

router.post('/login', function(req, res, next) {
    Users.findOne({
        where: {
            login: req.body.username,
            password: req.body.password
        }
    }).then(user => {
        if (user) {
            req.session.authenticated = true;
            req.session.user = user;
            res.redirect('/');
        } else {
            res.redirect('/auth/login');
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
    });
});

router.get('/logout', function (req, res, next) {
    req.session.authenticated = false;
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;
