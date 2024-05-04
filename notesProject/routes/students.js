const express = require('express');
const router = express.Router();

const studentsData = require('../models/index').Students;

router.get('/', function(req, res, next) {
    studentsData.findAll().then(students => {
        res.render('students', { students: students, navbar: res.locals.navbar, session: req.session });
    })
});

module.exports = router;
