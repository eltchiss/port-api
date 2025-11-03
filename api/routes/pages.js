const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const SECRET = process.env.SECRET_KEY || 'superSecretKey';

/* -----------------------------
   🏠 Page d'accueil
----------------------------- */
router.get('/', (req, res) => {
  res.render('index', { error: null });
});

/* -----------------------------
   🔐 Middleware de vérification du JWT dans le cookie
----------------------------- */
function checkTokenCookie(req, res, next) {
  const authCookie = req.cookies && (req.cookies.Authorization || req.cookies.token);
  if (!authCookie) return res.redirect('/');

  // Le cookie contient "Bearer xxx", on enlève le préfixe
  const token = authCookie.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded.user || decoded;
    req.token = token;
    next();
  } catch (err) {
    console.error('JWT invalide :', err.message);
    return res.redirect('/');
  }
}

/* -----------------------------
   📊 Dashboard
----------------------------- */
router.get('/dashboard', checkTokenCookie, async (req, res) => {
  const today = new Date().toLocaleDateString('fr-FR');

  res.render('dashboard', {
    user: req.user,
    date: today,
    reservations: [] // tu pourras les charger plus tard via un service
  });
});

/* -----------------------------
   ⚓ Page Catways (affiche la liste depuis l’API)
----------------------------- */
router.get('/catways', checkTokenCookie, async (req, res) => {
  try {
    // Appel interne à ton API protégée
    const response = await axios.get('http://localhost:3003/api/catways', {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    res.render('catways', {
      user: req.user,
      catways: response.data,
      error: null
    });
  } catch (err) {
    console.error('Erreur de récupération des catways :', err.message);
    res.render('catways', {
      user: req.user,
      catways: [],
      error: 'Impossible de charger les catways.'
    });
  }
});

/* -----------------------------
   🚪 Déconnexion
----------------------------- */
router.get('/logout', (req, res) => {
  res.clearCookie('Authorization');
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
