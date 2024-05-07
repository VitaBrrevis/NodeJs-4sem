const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = '';

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }
      req.user = decoded;
      next();
    });
  };

module.exports = {
  generateAccessToken: (data) => {
    return jwt.sign(data, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  },
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  },
  authenticateToken: authenticateToken,
  ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
};
