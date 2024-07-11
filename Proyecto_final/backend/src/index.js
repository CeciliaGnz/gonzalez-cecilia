const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS y JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas de usuario
const userRoutes = require('../src/routes/userRoutes');
app.use('/api/users', userRoutes);

// Rutas de autenticación
const authRoutes = require('../src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rutas de trabajos
const jobRoutes = require('../src/routes/jobRoutes');
app.use('/api/jobs', jobRoutes);

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


