const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// validar el login de un usuario
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    const isPasswordValid = (password == user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
