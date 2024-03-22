var express = require('express');
var router = express.Router();

const Users = require('../models/index').Users;

router.get('/signup', function (req, res, next) {
    res.render('signup');
});

router.post('/signup', function(req, res, next) {
    Users.create({
        login: req.body.username,
        password: req.body.password
    }).then(user => {
        res.redirect('/login');
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
    });    
    req.body.username
});

module.exports = router;
