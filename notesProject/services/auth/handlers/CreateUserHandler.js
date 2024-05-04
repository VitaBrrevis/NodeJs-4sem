const BaseHandler = require('./BaseHandler');
const bcrypt = require('bcrypt');
const Users = require('../../../models/index').Users;

class CreateUserHandler extends BaseHandler {
    async handleRequest(req, res) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await Users.create({
            login: req.body.username.toLowerCase(),
            password: hashedPassword,
            name: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
            surname: req.body.secondname.charAt(0).toUpperCase() + req.body.secondname.slice(1),
            phone: req.body.phone
        });

        req.flash('success', 'Account created successfully');
        res.redirect('/auth/login');
    }
}

module.exports = CreateUserHandler;