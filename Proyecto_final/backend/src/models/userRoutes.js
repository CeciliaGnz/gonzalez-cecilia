const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importa el modelo de usuario si es necesario

// Ruta para registrar un nuevo usuario
router.post('/', async (req, res) => {
  try {
    // Aquí va la lógica para crear un nuevo usuario
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
