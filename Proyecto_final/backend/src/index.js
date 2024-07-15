import express from 'express';
import morgan from "morgan";
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { PORT } from './config.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import paymentRoutes from './routes/payment.routes.js';

// Obtener __filename y __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar dotenv
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware CORS y JSON parsing
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración para servir archivos estáticos (CSS, HTML, JS)
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use(express.static(path.resolve("./src/public")));

// Conectar a MongoDB
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas de usuario
app.use('/api/users', userRoutes);

// Rutas de trabajos
app.use('/api/jobs', jobRoutes);

// Rutas de pagos
app.use('/api/payments', paymentRoutes);

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/html/registro.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
