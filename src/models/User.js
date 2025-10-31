const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


UserSchema.methods.toPublic = function(){ return { id: this._id, nome: this.nome, email: this.email } }

module.exports = mongoose.model('User', UserSchema);
