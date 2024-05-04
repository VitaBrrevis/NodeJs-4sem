const emailpattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordpattern = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
const phonepattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

module.exports = {
    emailpattern: emailpattern,
    passwordpattern: passwordpattern,
    phonepattern: phonepattern,
};