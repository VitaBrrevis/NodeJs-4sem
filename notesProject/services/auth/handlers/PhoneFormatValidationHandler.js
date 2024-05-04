const BaseHandler = require('./BaseHandler');
const patterns = require('../../../constants/patterns');

class PhoneFormatValidationHandler extends BaseHandler {
    handleRequest(req, res) {
        if (req.body.phone && !patterns.phonepattern.test(req.body.phone)) {
            req.flash('warning', 'Incorrect phone number format');
            return res.redirect('/auth/signup');
        }

        super.handleRequest(req, res);
    }
}

module.exports = PhoneFormatValidationHandler;