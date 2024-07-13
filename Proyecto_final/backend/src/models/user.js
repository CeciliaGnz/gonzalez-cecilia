const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
<<<<<<< HEAD
  profile: {type: Object, required: false},
  type: {type: String, required: false}
=======
  accountType: { type: String, required: true } // Agregado campo accountType
>>>>>>> fffdccce1b84cb9318ca45ec445c817e78d31706
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
