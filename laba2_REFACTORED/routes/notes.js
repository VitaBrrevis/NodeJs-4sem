var express = require('express');
var router = express.Router();

const Notes = require('../models/index').Notes;



router.get('/', function (req, res, next) {
    console.log('notes');
    Notes.findAll({
        where: {
            userid: 1
        }
    }).then(notes => {
        res.render('notes', { notes: notes, navbar: res.locals.navbar });
    })
    
});

module.exports = router;
