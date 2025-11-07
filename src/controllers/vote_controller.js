const Vote = require('../models/Vote');
const Idea = require('../models/Idea');

exports.toggleVote = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { ideaId } = req.body;

    if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado.' });
    if (!ideaId) return res.status(400).json({ erro: 'Informe o ID da ideia.' });

    const ideia = await Idea.findById(ideaId);
    if (!ideia) return res.status(404).json({ erro: 'Ideia não encontrada.' });

    const existingVote = await Vote.findOne({ user: userId, idea: ideaId });

    if (existingVote) {
      await existingVote.deleteOne();
      return res.json({ mensagem: 'Voto removido com sucesso.' });
    }

    const voto = await Vote.create({ user: userId, idea: ideaId });
    res.status(201).json({ mensagem: 'Voto registrado com sucesso!', voto });

  } catch (err) {
    console.error('Erro ao registrar voto:', err);
    res.status(500).json({ erro: 'Erro ao registrar voto.' });
  }
};

exports.getVotesByIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const votos = await Vote.find({ idea: ideaId }).populate('user', 'nome email');
    res.json({ total: votos.length, votos });
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
