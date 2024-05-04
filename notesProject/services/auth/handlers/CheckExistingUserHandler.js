const BaseHandler = require('./BaseHandler');
const Users = require('../../../models/index').Users;

class CheckExistingUserHandler extends BaseHandler {
    async handleRequest(req, res) {
        const existingUser = await Users.findOne({
            where: {
                login: req.body.username.toLowerCase()
            }
        });

        if (existingUser) {
            req.flash('warning', 'This email is already registered');
            return res.redirect('/auth/signup');
        }

        // If user is not found, pass the request to the next handler
        await super.handleRequest(req, res);
    }
}

module.exports = CheckExistingUserHandler;