var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('notes', { notes: Object.values(res.locals.notes), navbar: res.locals.navbar });
});

module.exports = router;
