// src/models/Idea.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdeaSchema = new Schema({
  titulo: { type: String, required: true, trim: true },
  descricao: { type: String, required: true },
  categoria: { type: String, required: true, trim: true }, // ex: "Processo", "Produto", "Custo"
  autor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

IdeaSchema.index({ titulo: 'text', descricao: 'text' });

module.exports = mongoose.model('Idea', IdeaSchema);