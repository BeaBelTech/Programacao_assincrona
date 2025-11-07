module.exports = (req, res, next) => {
  const estaLogado = !!req.session.userId;
  const rota = req.path;

  if (estaLogado && (rota === '/login' || rota === '/register')) {
    return res.redirect('/centro');
  }

  if (!estaLogado && rota !== '/login' && rota !== '/register') {
    return res.redirect('/login');
  }

  return next();
};
