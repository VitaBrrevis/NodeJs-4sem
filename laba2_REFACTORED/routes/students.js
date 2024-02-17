var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('students', { students: Object.values(res.locals.studentData) });
});

module.exports = router;
