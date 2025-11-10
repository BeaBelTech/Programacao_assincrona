const Idea = require('../models/Idea');
const Vote = require('../models/Vote');

exports.createIdea = async (req, res) => {
  try {
    const { titulo, descricao, categoria } = req.body;
    const autor = req.session.userId;

    if (!autor) {
      req.flash('error_msg', 'Usuário não autenticado');
      return res.redirect('/login');
    }

    if (!titulo || !descricao || !categoria) {
      req.flash('error_msg', 'Preencha todos os campos');
      return res.redirect('/create');
    }

    await Idea.create({ titulo, descricao, categoria, autor });
    req.flash('success_msg', 'Ideia criada com sucesso!');
    res.redirect('/centro');
  } catch (err) {
    console.log(err)
    req.flash('error_msg', 'Erro ao cadastrar ideia');
  }
};

exports.getAllIdeas = async (req, res) => {
  try {
    const userId = req.session.userId.toString();

    const ideiasPlain = await Idea.find()
      .populate('autor', 'nome email')
      .lean();

    for (const idea of ideiasPlain) {
      const votes = await Vote.find({ idea: idea._id }).lean();
      idea.totalVotes = votes.length;

      const userVote = await Vote.findOne({ user: userId, idea: idea._id }).lean();
      idea.userHasVoted = !!userVote;

      idea.isOwner = idea.autor._id.toString() === userId;
    }

    ideiasPlain.sort((a, b) => b.totalVotes - a.totalVotes);

    res.render('centro', { ideias: ideiasPlain });
  } catch (err) {
    req.flash('error_msg', 'Erro ao buscar ideias');
    res.redirect('/centro');
  }
};

exports.getIdeaById = async (req, res) => {
  try {
    const ideia = await Idea.findById(req.params.id)
      .populate('autor', 'nome email')
      .lean();

    if (!ideia) {
      req.flash('error_msg', 'Ideia não encontrada');
      return res.redirect('/centro');
    }

    if (ideia.autor._id.toString() !== req.session.userId) {
      req.flash('error_msg', 'Acesso negado');
      return res.redirect('/centro');
    }

    res.render('update', { ideia });
  } catch (err) {
    req.flash('error_msg', 'Erro ao buscar ideia');
    res.redirect('/centro');
  }
};

exports.updateIdea = async (req, res) => {
  try {
    const { titulo, descricao, categoria } = req.body;
    const ideia = await Idea.findById(req.params.id);

    if (!ideia) {
      req.flash('error_msg', 'Ideia não encontrada');
      return res.redirect('/centro');
    }

    if (ideia.autor._id.toString() !== req.session.userId) {
      req.flash('error_msg', 'Acesso negado');
      return res.redirect('/centro');
    }

    ideia.titulo = titulo || ideia.titulo;
    ideia.descricao = descricao || ideia.descricao;
    ideia.categoria = categoria || ideia.categoria;
    ideia.updatedAt = new Date();

    await ideia.save();

    req.flash('success_msg', 'Ideia atualizada com sucesso!');
    res.redirect('/centro');
  } catch (err) {
    req.flash('error_msg', 'Erro ao atualizar ideia');
    res.redirect('/centro');
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const ideia = await Idea.findById(req.params.id);

    if (!ideia) {
      req.flash('error_msg', 'Ideia não encontrada');
      return res.status(404).json({ erro: 'Ideia não encontrada' });
    }

    if (ideia.autor._id.toString() !== req.session.userId) {
      req.flash('error_msg', 'Acesso negado');
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    await ideia.deleteOne();
    res.redirect('/centro');
    return req.flash('success_msg', 'Ideia deletada com sucesso!');
  } catch (err) {
    return req.flash('error_msg', 'Erro ao deletar ideia');
  }
};

exports.getIdeasByUser = async (req, res) => {
  try {
    const ideias = await Idea.find({ autor: req.params.userId })
      .populate('autor', 'nome email')
      .sort({ createdAt: -1 })
      .lean();

    res.json(ideias);
  } catch (err) {
    req.flash('error_msg', 'Erro ao buscar ideias do usuário');
    res.status(500).json({ erro: 'Erro ao buscar ideias do usuário.' });
  }
};
