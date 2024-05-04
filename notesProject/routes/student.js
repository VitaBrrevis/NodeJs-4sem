const express = require('express');
const router = express.Router();

const Students = require('../models/index').Students;

router.get('/student/:name', (req, res) => {
    const name = req.params.name;
    Students.findOne({ where: { name: name } })
        .then(student => {
            if (!student) {
                return res.status(404).send('Student not found');
            }
            
            res.render('student', { student: student, navbar: res.locals.navbar, session: req.session });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
});


module.exports = router;
