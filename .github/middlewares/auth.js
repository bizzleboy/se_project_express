const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Error();
    }
    const token = authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Not authorized to access this resource' });
  }
};

module.exports = auth;
