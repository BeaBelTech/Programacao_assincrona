
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');
const Idea = require('../models/Idea');
const Vote = require('../models/Vote');

async function run() {
  await connectDB(process.env.MONGODB_URI);

  try {

    await Promise.all([
      User.deleteMany({}),
      Idea.deleteMany({}),
      Vote.deleteMany({})
    ]);
    console.log('Collections limpas.');

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash('senha123', salt);

    const user1 = await User.create({ nome: 'Alice', email: 'alice@example.com', passwordHash: senhaHash });
    const user2 = await User.create({ nome: 'Bob', email: 'bob@example.com', passwordHash: senhaHash });


    const idea1 = await Idea.create({
      titulo: 'Reduzir tempo de aprovação',
      descricao: 'Automatizar parte do fluxo para reduzir tempo.',
      categoria: 'Processo',
      autor: user1._id
    });

    const idea2 = await Idea.create({
      titulo: 'Novo painel de indicadores',
      descricao: 'Painel com métricas de engajamento.',
      categoria: 'Produto',
      autor: user2._id
    });

    await Vote.create({ user: user2._id, idea: idea1._id });

    console.log('Seed finalizado ✅');
  } catch (err) {
    console.error('Erro no seed:', err);
  } finally {
    mongoose.connection.close();
  }
}

run();
