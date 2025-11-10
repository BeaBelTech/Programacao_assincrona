const Vote = require('../models/Vote');
const Idea = require('../models/Idea');

exports.addVote = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { ideaId } = req.body;

    if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado.' });
    if (!ideaId) return res.status(400).json({ erro: 'Informe o ID da ideia.' });

    const ideia = await Idea.findById(ideaId);
    if (!ideia) return res.status(404).json({ erro: 'Ideia não encontrada.' });

    // 🔥 Verifica se o usuário já votou em qualquer ideia
    const previousVote = await Vote.findOne({ user: userId });

    if (previousVote) {
      // Remover voto anterior
      await previousVote.deleteOne();
    }

    // Adicionar novo voto
    const voto = await Vote.create({ user: userId, idea: ideaId });
    res.status(201).json({ mensagem: 'Voto registrado com sucesso!', voto });

  } catch (err) {
    console.error('Erro ao adicionar voto:', err);
    res.status(500).json({ erro: 'Erro ao adicionar voto.' });
  }
};


exports.removeVote = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { ideaId } = req.body;

    if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado.' });
    if (!ideaId) return res.status(400).json({ erro: 'Informe o ID da ideia.' });

    const existing = await Vote.findOne({ user: userId, idea: ideaId });
    if (!existing) {
      return res.status(404).json({ erro: 'Voto não encontrado.' });
    }

    await existing.deleteOne();
    res.json({ mensagem: 'Voto removido com sucesso.' });

  } catch (err) {
    console.error('Erro ao remover voto:', err);
    res.status(500).json({ erro: 'Erro ao remover voto.' });
  }
};

exports.getVotesByIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const votos = await Vote.find({ idea: ideaId }).populate('user', 'nome email');
    res.render('centro', { votos });
  } catch (err) {
    console.error('Erro ao buscar votos:', err);
    res.status(500).json({ erro: 'Erro ao buscar votos.' });
  }
};

exports.countVotes = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const total = await Vote.countDocuments({ idea: ideaId });
    res.json({ ideaId, total });
  } catch (err) {
    console.error('Erro ao contar votos:', err);
    res.status(500).json({ erro: 'Erro ao contar votos.' });
  }
};
