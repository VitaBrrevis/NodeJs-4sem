const CheckExistingUserHandler = require("./handlers/CheckExistingUserHandler")
const EmailFormatValidationHandler = require("./handlers/EmailFormatValidationHandler")
const PasswordComplexityValidationHandler = require("./handlers/PasswordComplexityValidationHandler")
const PhoneFormatValidationHandler = require("./handlers/PhoneFormatValidationHandler")
const CreateUserHandler = require("./handlers/CreateUserHandler")

const authChain = new CheckExistingUserHandler();
const emailFormatValidationHandler = new EmailFormatValidationHandler();
const passwordComplexityValidationHandler = new PasswordComplexityValidationHandler();
const phoneFormatValidationHandler = new PhoneFormatValidationHandler();
const createUserHandler = new CreateUserHandler();

authChain.setNextHandler(emailFormatValidationHandler)
    .setNextHandler(passwordComplexityValidationHandler)
    .setNextHandler(phoneFormatValidationHandler)
    .setNextHandler(createUserHandler);

module.exports = authChain;
