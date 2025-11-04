const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');

const SECRET = process.env.SECRET_KEY || 'superSecretKey';

/*Page d'accueil*/
router.get('/', (req, res) => {
  res.render('index', { error: null });
});

/*Middleware de vérification du JWT dans le cookie*/
function checkTokenCookie(req, res, next) {
  const authCookie = req.cookies && (req.cookies.Authorization || req.cookies.token);
  if (!authCookie) return res.redirect('/');

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

/* Dashboard*/
router.get('/dashboard', checkTokenCookie, async (req, res) => {
  const today = new Date().toLocaleDateString('fr-FR');

  res.render('dashboard', {
    user: req.user,
    date: today,
    reservations: []
  });
});

/* Lister tous les catways */
router.get('/catways', checkTokenCookie, async (req, res) => {
  try {
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

/* Créer un catway */
router.post('/catways', checkTokenCookie, async (req, res) => {
  const { catwayNumber, catwayType, catwayState } = req.body;

  try {
    await axios.post(
      'http://localhost:3003/api/catways',
      { catwayNumber, catwayType, catwayState },
      { headers: { Authorization: `Bearer ${req.token}` } }
    );
    res.redirect('/catways');
  } catch (err) {
    console.error('Erreur lors de la création du catway :', err.message);
    res.render('catways', {
      user: req.user,
      catways: [],
      error: 'Erreur lors de la création du catway.'
    });
  }
});

/*Modifier l’état d’un catway*/
router.post('/catways/:id/update', checkTokenCookie, async (req, res) => {
  try {
    await axios.put(
      `http://localhost:3003/api/catways/${req.params.id}`,
      { catwayState: req.body.catwayState },
      { headers: { Authorization: `Bearer ${req.token}` } }
    );
    res.redirect('/catways');
  } catch (err) {
    console.error('Erreur modification catway :', err.message);
    res.redirect('/catways');
  }
});

/* Voir le détail d’un catway*/
router.get('/catways/:id', checkTokenCookie, async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3003/api/catways/${req.params.id}`, {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    res.render('catwayDetails', {
      user: req.user,
      catway: response.data,
      error: null
    });
  } catch (err) {
    console.error('Erreur détail catway :', err.message);
    res.redirect('/catways');
  }
});

/*Supprimer un catway*/
router.post('/catways/:id/delete', checkTokenCookie, async (req, res) => {
  try {
    await axios.delete(`http://localhost:3003/api/catways/${req.params.id}`, {
      headers: { Authorization: `Bearer ${req.token}` }
    });
    res.redirect('/catways');
  } catch (err) {
    console.error('Erreur suppression catway :', err.message);
    res.redirect('/catways');
  }
});

/* Déconnexion */
router.get('/logout', (req, res) => {
  res.clearCookie('Authorization');
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
