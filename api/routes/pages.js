const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY || 'superSecretKey';

// page d'accueil
router.get('/', (req, res) => {
  res.render('index', { error: null });
});

// Middleware local pour vérifier token cookie et injecter req.user
function checkTokenCookie(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    // token structure : { user: { ... }, iat, exp }
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    console.error('JWT invalide :', err.message);
    return res.redirect('/');
  }
}

// dashboard protégé
router.get('/dashboard', checkTokenCookie, async (req, res) => {
  // Si tu veux récupérer des réservations, fais-le ici via un service
  const today = new Date().toLocaleDateString('fr-FR');

  // req.user contient { _id, username, email } si tu as respecté le payload
  res.render('dashboard', {
    user: req.user,
    date: today,
    reservations: [] // remplacer par les réservations réelles via service
  });
});

// déconnexion : supprime le cookie 'token'
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
