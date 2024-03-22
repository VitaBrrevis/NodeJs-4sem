var express = require('express');
var router = express.Router();

const studentsData = require('../models/index').Students;

router.get('/', function(req, res, next) {
    studentsData.findAll().then(students => {
        res.render('students', { students: students, navbar: res.locals.navbar });
    })
});

module.exports = router;
