const express = require('express');
const router = express.Router();
router.get('/student/:name', (req, res) => {
    const name = req.params.name;
    if (studentData.hasOwnProperty(name)) {
        res.render('student', { student: studentData[name], navbar: res.locals.navbar });
    } else {
        res.status(404).send('Student not found');
    }
});


module.exports = router;
