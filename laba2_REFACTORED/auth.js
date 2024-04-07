const jwt = require('jsonwebtoken');
ACCESS_TOKEN_SECRET = '2bb1eb449485fafcf84e811f50b06a16d240d2df42b8b4644b0aec01696822e91fe042a1c83f4b2d782a2bd1e0a2bdf39c7901338d7024db9661494c8e848a32'


module.exports = {
    // A function to generate a JWT token
    generateAccessToken: function (user) {
        return jwt.sign(user, ACCESS_TOKEN_SECRET);
    },
    // A function to verify a JWT token
    authenticateToken: function (req, res,next) {
        const token = req.cookies.token;
        if (token == null) return res.status(401).send('Unauthorized');
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).send('Forbidden');
            req.user = user;
            next();
        });
    }
}