const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ObjectId } = require('mongodb');

const generateToken = (user) => {

  const payload = { password: user.password, username: user.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token  // Sin `expiresIn`
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.sendStatus(403);
    const user = await User.findOne({ username: payload.username, password: payload.password });
    if (!user) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = { generateToken, authenticateToken };
