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

/*GESTION DES CATWAYS */

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

/*GESTION DES UTILISATEURS*/

/* Lister tous les utilisateurs */
router.get('/users', checkTokenCookie, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3003/api/users', {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    res.render('users', {
      user: req.user,
      users: response.data,
      error: null
    });
  } catch (err) {
    console.error('Erreur de récupération des utilisateurs :', err.message);
    res.render('users', {
      user: req.user,
      users: [],
      error: 'Impossible de charger les utilisateurs.'
    });
  }
});

/* Créer un utilisateur */
router.post('/users', checkTokenCookie, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await axios.post(
      'http://localhost:3003/api/users',
      { username, email, password },
      { headers: { Authorization: `Bearer ${req.token}` } }
    );
    res.redirect('/users');
  } catch (err) {
    console.error('Erreur lors de la création de l’utilisateur :', err.message);
    res.render('users', {
      user: req.user,
      users: [],
      error: 'Erreur lors de la création de l’utilisateur.'
    });
  }
});

/* Modifier un utilisateur */
router.post('/users/:email/update', checkTokenCookie, async (req, res) => {
  try {
    await axios.put(
      `http://localhost:3003/api/users/${encodeURIComponent(req.params.email)}`,
      req.body,
      { headers: { Authorization: `Bearer ${req.token}` } }
    );
    res.redirect('/users');
  } catch (err) {
    console.error('Erreur modification utilisateur :', err.message);
    res.redirect('/users');
  }
});

/* Voir le détail d’un utilisateur */
router.get('/users/:email', checkTokenCookie, async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3003/api/users/${encodeURIComponent(req.params.email)}`, {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    res.render('userDetails', {
      user: req.user,
      userDetails: response.data,
      error: null
    });
  } catch (err) {
    console.error('Erreur détail utilisateur :', err.message);
    res.redirect('/users');
  }
});

/* Supprimer un utilisateur */
router.post('/users/:email/delete', checkTokenCookie, async (req, res) => {
  try {
    await axios.delete(`http://localhost:3003/api/users/${encodeURIComponent(req.params.email)}`, {
      headers: { Authorization: `Bearer ${req.token}` }
    });
    res.redirect('/users');
  } catch (err) {
    console.error('Erreur suppression utilisateur :', err.message);
    res.redirect('/users');
  }
});

/* GESTION DES RESERVATIONS */
/* Lister les réservations */
router.get('/reservations', checkTokenCookie, async (req, res) => {
  try {
    // une route "globale" /api/reservations 
    try {
      const respGlobal = await axios.get('http://localhost:3003/api/reservations', {
        headers: { Authorization: `Bearer ${req.token}` }
      });
      return res.render('reservations', {
        user: req.user,
        reservations: respGlobal.data,
        error: null
      });
    } catch (errGlobal) {
      // si la route globale n'existe pas, on fera le fallback (poursuite)
      // console.log('Pas de route globale /api/reservations, fallback -> aggreg catways');
    }

    // récupérer tous les catways puis leurs réservations (sous-resources)
    const catwaysResp = await axios.get('http://localhost:3003/api/catways', {
      headers: { Authorization: `Bearer ${req.token}` }
    });
    const catways = catwaysResp.data || [];

    // Pour chaque catway on récupère ses réservations
    const reservationsPromises = catways.map(c =>
      axios.get(`http://localhost:3003/api/catways/${encodeURIComponent(c.catwayNumber || c._id)}/reservations`, {
        headers: { Authorization: `Bearer ${req.token}` }
      }).then(r => r.data).catch(e => {
        // si une sous-route échoue on renvoie [] pour ce catway
        console.error(`Erreur récupération réservations catway ${c.catwayNumber || c._id}:`, e.response ? e.response.data : e.message);
        return [];
      })
    );

    const nested = await Promise.all(reservationsPromises);
    // aplatir et ajouter information du catway si tu veux
    const reservations = nested.flat().map(r => ({ ...r }));

    res.render('reservations', {
      user: req.user,
      reservations,
      error: null
    });
  } catch (err) {
    console.error('Erreur récupération globale des réservations :', err.response ? err.response.data : err.message);
    res.render('reservations', {
      user: req.user,
      reservations: [],
      error: 'Impossible de charger les réservations.'
    });
  }
});



/* Déconnexion */
router.get('/logout', (req, res) => {
  res.clearCookie('Authorization');
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
