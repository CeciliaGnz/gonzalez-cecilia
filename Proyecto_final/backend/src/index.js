const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('../src/models/userRoutes');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS y JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../../frontend/html')));

// Conectar a MongoDB
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas de usuario

app.use('/api/users', userRoutes);

app.get('/health-check', (req, res) => {
  res.json({ message: 'I am alive!' });
});

// Endpoint para servir el archivo de registro "/" luego colocar /registro , el que va solo es el home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/html/registro.html'));
});

/* Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('Hola*/

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
