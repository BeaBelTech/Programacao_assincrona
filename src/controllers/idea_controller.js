const Idea = require('../models/Idea');
const Vote = require('../models/Vote');

exports.createIdea = async (req, res) => {
  try {
    const { titulo, descricao, categoria } = req.body;
    const autor = req.session.userId;

    if (!autor) return res.status(401).json({ erro: 'Usuário não autenticado.' });
    if (!titulo || !descricao || !categoria)
      return res.status(400).json({ erro: 'Preencha todos os campos.' });

    const ideia = await Idea.create({ titulo, descricao, categoria, autor });
    res.redirect('/centro');
  } catch (err) {
    console.error('Erro ao criar ideia:', err);
    res.status(500).json({ erro: 'Erro ao criar ideia.' });
  }
};

exports.getAllIdeas = async (req, res) => {
  try {
    const userId = req.session.userId.toString()

    const ideiasPlain = await Idea.find()
      .populate('autor', 'nome email')
      .lean();

    const userVote = await Vote.findOne({ user: userId }).lean()

    for (const idea of ideiasPlain) {
      const votes = await Vote.find({ idea: idea._id }).lean();
      idea.totalVotes = votes.length;

      idea.userHasVoted = userVote && userVote.idea.toString() === idea._id.toString();
    }

    ideiasPlain.sort((a, b) => b.totalVotes - a.totalVotes);

    res.render('centro', { ideias: ideiasPlain });

  } catch (err) {
    console.error('Erro ao listar ideias:', err);
    res.status(500).send('Erro ao buscar ideias.');
  }
};

exports.getIdeaById = async (req, res) => {
  try {
    const ideia = await Idea.findById(req.params.id)
      .populate('autor', 'nome email').lean();

    if (ideia.autor._id.toString() !== req.session.userId) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    if (!ideia) {
      return res.status(404).send("Ideia não encontrada.");

    }


    return res.render('update', { ideia });
  } catch (err) {
    console.error('Erro ao buscar ideia:', err);
    return res.status(500).send("Erro ao buscar ideia.");
  }
};


exports.updateIdea = async (req, res) => {
  try {
    const { titulo, descricao, categoria } = req.body;
    const ideia = await Idea.findById(req.params.id);

    if (!ideia) return res.status(404).json({ erro: 'Ideia não encontrada.' });

    if (ideia.autor._id.toString() !== req.session.userId) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    ideia.titulo = titulo || ideia.titulo;
    ideia.descricao = descricao || ideia.descricao;
    ideia.categoria = categoria || ideia.categoria;
    ideia.updatedAt = new Date();

    await ideia.save();

    res.redirect('/centro');
  } catch (err) {
    console.error('Erro ao atualizar ideia:', err);
    res.status(500).json({ erro: 'Erro ao atualizar ideia.' });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const ideia = await Idea.findById(req.params.id);

    if (!ideia) return res.status(404).json({ erro: 'Ideia não encontrada.' });

    if (ideia.autor._id.toString() !== req.session.userId) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    await ideia.deleteOne();
    res.json({ mensagem: 'Ideia deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar ideia:', err);
    res.status(500).json({ erro: 'Erro ao deletar ideia.' });
  }
};

exports.getIdeasByUser = async (req, res) => {
  try {
    const ideias = await Idea.find({ autor: req.params.userId })
      .populate('autor', 'nome email')
      .sort({ createdAt: -1 });

    res.json(ideias);
  } catch (err) {
    console.error('Erro ao listar ideias do usuário:', err);
    res.status(500).json({ erro: 'Erro ao buscar ideias do usuário.' });
  }
};
