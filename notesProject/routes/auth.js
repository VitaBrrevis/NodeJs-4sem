const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const authChain = require('../services/auth/authChain');

const auth = require('../auth');
const Users = require('../models/index').Users;


router.get('/signup', function (req, res, next) {
    if (req.session.authenticated) {
        res.redirect('/');
    } else{
        res.render('signup', { message: req.flash(), messages: res.locals.messages });
    }
});

router.post('/signup', async (req, res) => {
    try {
        await authChain.handleRequest(req, res);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Internal server error. Please try again later');
        res.redirect('/auth/signup');
    }
});

router.get('/login', function (req, res, next) {
    if (req.session.authenticated) {
        return res.redirect('/');
    }

    res.render('login', { message: req.flash(), messages: res.locals.messages });
});

router.post('/login', function(req, res, next) {
    
    Users.findOne({
        where: {
            login: req.body.username.toLowerCase(),
        }
    }).then(user => {
        bcrypt.compare(req.body.password, user.password).then(result => {

            if (!result) {
                req.flash('warning', 'Incorrect username or password');
                return res.redirect('/auth/login');
            }

            req.session.authenticated = true;
            req.session.user = user;
            res.cookie('token', auth.generateAccessToken({login: user.login, id: user.id}));
            res.redirect('/');
        }).catch(err => {
            req.flash('warning', 'Incorrect username or password');
            res.redirect('/auth/login');
        });
    }).catch(err => {
        req.flash('warning', 'Incorrect username or password');
        res.redirect('/auth/login');
    });
});

router.get('/logout', function (req, res, next) {
    req.session.authenticated = false;
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;
