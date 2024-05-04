const BaseHandler = require('./BaseHandler');
const patterns = require('../../../constants/patterns');

class EmailFormatValidationHandler extends BaseHandler {
    handleRequest(req, res) {
        if (!patterns.emailpattern.test(req.body.username)) {
            req.flash('warning', 'Invalid email address');
            return res.redirect('/auth/signup');
        }

        // If email format is valid, pass the request to the next handler
        super.handleRequest(req, res);
    }
}

module.exports = EmailFormatValidationHandler;