var express = require('express');
var router = express.Router();

const Notes = require('../models/index').Notes;

router.get('/', function (req, res, next) {
    if(req.session.authenticated){
        Notes.findAll({
            where: {
                userid: req.session.user.id
            }
        }).then(notes => {
            res.render('notes', { notes: notes, navbar: res.locals.navbar, session: req.session });
        })
    } else{
        res.locals.message = 'Login first to see notes';
        res.redirect('/auth/login');
    }    
});

router.post('/', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    Notes.create({ title: title, content: content, userid: req.session.user.id })
        .then(() => {
            res.message = 'Note created successfully';
            res.redirect('/notes');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
  });


module.exports = router;
