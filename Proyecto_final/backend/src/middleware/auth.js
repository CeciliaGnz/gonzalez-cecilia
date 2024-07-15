import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateToken = (user) => {
  const payload = { password: user.password, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.sendStatus(403);
    const user = await User.findOne({ email: payload.email, password: payload.password });
    if (!user) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Exporta como ES Module
export { generateToken, authenticateToken };
