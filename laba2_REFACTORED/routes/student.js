const express = require('express');
const router = express.Router();

router.get('/:name', function(req, res) {
    const name = req.params.name;    if (studentData.hasOwnProperty(name)) {
        res.render('student', { student: studentData[name] });
    } else {  res.status(404).send('Студент не найден');
    }
});

module.exports = router;
