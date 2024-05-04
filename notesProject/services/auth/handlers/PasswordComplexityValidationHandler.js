const BaseHandler = require('./BaseHandler');

class PasswordComplexityValidationHandler extends BaseHandler {
    handleRequest(req, res) {
        if (req.body.password.length < 6 || !/\d/.test(req.body.password) || !/[A-Z]/.test(req.body.password)) {
            req.flash('warning', 'Password format is incorrect');
            return res.redirect('/auth/signup');
        }

        // If password format is valid, pass the request to the next handler
        super.handleRequest(req, res);
    }
}

module.exports = PasswordComplexityValidationHandler;