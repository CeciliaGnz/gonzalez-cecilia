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
    education: { type: String, default: ''}, // education no agarra
    skills: { type: String, default: ''}, 
    languages: { type: String, default: ''},
    portfolio: { type: String, default: '' },
    linkedin: { type: String, default: '' } 
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
