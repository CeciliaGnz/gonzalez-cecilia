import express from "express";
import User from "../models/user.js"; // Importa el modelo de usuario
import { generateToken, authenticateToken } from "../middleware/auth.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

// Función para validar la complejidad de la contraseña
function validatePassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return regex.test(password);
}

// Ruta para registrar un nuevo usuario
router.post("/", async (req, res) => {
  const { username, email, password, type } = req.body;
  // Verificar la complejidad de la contraseña
  if (!validatePassword(password)) {
    return res.status(400).json({
      message: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo.",
    });
  }

  try {
    // Verificar si el correo ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está en uso." });
    }

    // Crear y guardar el nuevo usuario
    const newUser = new User({ username, email, password, type });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    const token = generateToken(user);
    // Redirigir según el tipo de cuenta
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      type: user.type,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener el perfil del usuario logueado
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Excluye la contraseña
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para actualizar el perfil del usuario contratista
router.put('/me', authenticateToken, async (req, res) => {
  const { phone, company, nationality, username } = req.body; // Campos editables

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profile: { phone, company, nationality },
        username // Agregar el username aquí
      },
      { new: true, runValidators: true } // Devuelve el nuevo documento
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para actualizar el perfil del talento
router.put('/meTalent', authenticateToken, async (req, res) => {
  const { phone, nationality, username, education, skills, languages, portfolio, linkedin } = req.body; // Campos editables

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profile: { 
          phone, 
          nationality, 
          skills,  
          education,      
          languages,     
          portfolio,    
          linkedin       
        },
        username // Agregar el username aquí
      },
      { new: true, runValidators: true } // Devuelve el nuevo documento
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// Exporta el router
export default router;
