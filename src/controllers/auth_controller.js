const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos.' });
    }   

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(senha, salt);

    const user = await User.create({ nome, email, passwordHash });

    req.session.userId = user._id;

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', user: { id: user._id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe email e senha.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ erro: 'Usuário não encontrado.' });
    }

    const match = await bcrypt.compare(senha, user.passwordHash);
    if (!match) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }


    req.session.userId = user._id;

    res.json({ mensagem: 'Login realizado com sucesso!', user: { id: user._id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao encerrar sessão.' });
    }
    res.clearCookie('connect.sid');
    res.json({ mensagem: 'Logout realizado com sucesso.' });
  });
};
