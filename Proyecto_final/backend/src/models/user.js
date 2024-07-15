import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    nationality: { type: String, default: '' },
    skills: { type: String, default: ''}, // Habilidades
    languages: { type: String, default: ''}, // Idiomas
    portfolio: { type: String, default: '' }, // URL del portafolio
    linkedin: { type: String, default: '' } // URL de LinkedIn
  },
  type: { type: String, required: false }
});


// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
