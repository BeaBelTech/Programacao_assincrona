const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return req.flash('error_msg', 'Preencha todos os campos');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return req.flash('error_msg', 'Usuário já cadastrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(senha, salt);

    const user = await User.create({ nome, email, passwordHash });

    req.session.userId = user._id;

    req.flash('success_msg', 'Cadastrado com sucesso!');
    return res.redirect('/login');

  } catch (err) {

    return req.flash('error_msg', 'Erro ao cadastrar');
  }
};


exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return req.flash('error_msg', 'Informe email e senha');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return req.flash('error_msg', 'Usuário não encontrado');
    }

    const match = await bcrypt.compare(senha, user.passwordHash);
    if (!match) {
      return req.flash('error_msg', 'Senha incorreta');
    }


    req.session.userId = user._id;

    res.redirect('/centro');
  } catch (err) {
    req.flash('error_msg', 'Erro ao fazer login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return req.flash('error_msg', 'Erro ao encontrar sessão.');
    }
    res.clearCookie('connect.sid');
  });
};
