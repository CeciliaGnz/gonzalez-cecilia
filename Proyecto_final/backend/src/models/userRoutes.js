const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Función para validar la complejidad de la contraseña
function validatePassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Ruta para registrar un nuevo usuario
router.post('/', async (req, res) => {
  const { username, email, password, accountType } = req.body;
  // Verificar la complejidad de la contraseña
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo.' });
  }

  try {
    // Verificar si el correo ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso.' });
    }

    // Crear y guardar el nuevo usuario
    const newUser = new User({ username, email, password, accountType });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Redirigir según el tipo de cuenta
    res.status(200).json({ message: 'Inicio de sesión exitoso', accountType: user.accountType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
