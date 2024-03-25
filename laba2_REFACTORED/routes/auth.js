var express = require('express');
var router = express.Router();

const Users = require('../models/index').Users;

const emailpattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordpattern = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;

router.get('/signup', function (req, res, next) {
    if (req.session.authenticated) {
        res.redirect('/');
    } else{
        res.render('signup', { message: req.flash(), messages: res.locals.messages });
    }
});

router.post('/signup', function(req, res, next) {
    Users.findOne({
        where: {
            login: req.body.username.toLowerCase()
        }
    }).then(user => {
        if (user) {
            res.redirect('/auth/signup');
        } else if (emailpattern.test(req.body.username) === false) {
            req.flash('warning', 'Invalid email address');
            res.redirect('/auth/signup');
        } else if (!req.body.password.match(/^.{6,}$/)){
            req.flash('warning', 'Password is too short');
            res.redirect('/auth/signup');
        } else if (!req.body.password.match(/\d/)){
            req.flash('warning', 'Password must contain at least one digit');
            res.redirect('/auth/signup');
        } else if (!req.body.password.match(/[A-Z]/)){
            req.flash('warning', 'Password must contain at least one uppercase letter');
            res.redirect('/auth/signup');
        } else if (req.body.phone && !req.body.phone.match()){
            req.flash('warning', 'Incorrect phone number format');
            res.redirect('/auth/signup');
        } else if (passwordpattern.test(req.body.password) === false) {
            req.flash('warning', 'Password format is incorrect');
            res.redirect('/auth/signup');
        } else {
            Users.create({
                login: req.body.username.toLowerCase(),
                password: req.body.password,
                name: req.body.firstname,
                surname: req.body.secondname,
                phone: req.body.phone
            }).then(user => {
                req.flash('success', 'Account created successfully');
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
        res.render('login', { message: req.flash(), messages: res.locals.messages });
    }
});

router.post('/login', function(req, res, next) {
    Users.findOne({
        where: {
            login: req.body.username.toLowerCase(),
            password: req.body.password
        }
    }).then(user => {
        if (user) {
            req.session.authenticated = true;
            req.session.user = user;
            res.redirect('/');
        } else {
            req.flash('warning', 'Incorrect username or password');
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
