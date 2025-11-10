const Vote = require('../models/Vote');

exports.toggleVote = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { ideaId } = req.body;

    if (!userId) {
      req.flash('error_msg', 'Você precisa estar logado para votar.');
      return setTimeout(() => res.redirect('/login'), 2000);
    }

    if (!ideaId) {
      req.flash('error_msg', 'ID da ideia não informado.');
      return setTimeout(() => res.redirect('/centro'), 2000);
    }

    // Voto existente na mesma ideia
    const existingVote = await Vote.findOne({ user: userId, idea: ideaId });
    if (existingVote) {
      await Vote.findOneAndDelete({ _id: existingVote._id });
      req.flash('success_msg', 'Seu voto foi removido.');
      return setTimeout(() => res.redirect('/centro'), 2000);
    }

    // Voto em outra ideia
    const previousVote = await Vote.findOne({ user: userId });
    if (previousVote) {
      previousVote.idea = ideaId;
      await previousVote.save();
      req.flash('success_msg', 'Seu voto foi movido para outra ideia.');
      return setTimeout(() => res.redirect('/centro'), 2000);
    }

    // Nunca votou 
    await Vote.create({ user: userId, idea: ideaId });
    req.flash('success_msg', 'Voto registrado com sucesso!');
    return setTimeout(() => res.redirect('/centro'), 2000);

  } catch (err) {
    console.error('Erro ao alternar voto:', err);
    req.flash('error_msg', 'Erro ao registrar voto.');
    return setTimeout(() => res.redirect('/centro'), 2000);
  }
};

exports.getVotesByIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const votos = await Vote.find({ idea: ideaId }).populate('user', 'nome email');
    res.render('centro', { votos });
  } catch (err) {
    req.flash('error_msg', 'Erro ao buscar votos da ideia.');
    res.redirect('/centro');
  }
};

exports.countVotes = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const total = await Vote.countDocuments({ idea: ideaId });
    return res.json({ ideaId, total });
  } catch (err) {
    console.error('Erro ao contar votos:', err);
    req.flash('error_msg', 'Erro ao contar votos.');
    return res.redirect('/centro');
  }
};

