const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');


// CONFIGURATION & MIDDLEWARES


// Clé secrète utilisée pour vérifier la signature des jetons JWT.
// Doit correspondre à la clé utilisée par le service d'authentification.
const SECRET = process.env.SECRET_KEY || 'superSecretKey';

// Middleware : Vérifie la présence et la validité du token JWT dans les cookies
function checkTokenCookie(req, res, next) {
  const authCookie = req.cookies && (req.cookies.Authorization || req.cookies.token);

  if (!authCookie) {
    return res.redirect('/');
  }

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


// PAGE D’ACCUEIL (LOGIN / REDIRECTION)


router.get('/', (req, res) => {
  const hasToken = req.cookies && (req.cookies.Authorization || req.cookies.token);

  if (hasToken) {
    return res.redirect('/dashboard');
  }

  res.render('index', { error: null });
});


// ROUTES PROTÉGÉES


// GET /dashboard
router.get('/dashboard', checkTokenCookie, async (req, res) => {
  const today = new Date().toLocaleDateString('fr-FR');

  res.render('dashboard', {
    user: req.user,
    date: today,
    reservations: [] // à charger dynamiquement au besoin
  });
});

// GET /logout
router.get('/logout', (req, res) => {
  res.clearCookie('Authorization');
  res.clearCookie('token');
  res.redirect('/');
});


// GESTION DES CATWAYS


// GET /catways
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

// POST /catways
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

// POST /catways/:id/update
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

// GET /catways/:id
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

// POST /catways/:id/delete
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


// GESTION DES UTILISATEURS

// GET /users
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

// POST /users
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

// POST /users/:email/update
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

// GET /users/:email
router.get('/users/:email', checkTokenCookie, async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:3003/api/users/${encodeURIComponent(req.params.email)}`,
      { headers: { Authorization: `Bearer ${req.token}` } }
    );

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

// POST /users/:email/delete
router.post('/users/:email/delete', checkTokenCookie, async (req, res) => {
  try {
    await axios.delete(
      `http://localhost:3003/api/users/${encodeURIComponent(req.params.email)}`,
      { headers: { Authorization: `Bearer ${req.token}` } }
    );
    res.redirect('/users');
  } catch (err) {
    console.error('Erreur suppression utilisateur :', err.message);
    res.redirect('/users');
  }
});


// GESTION DES RÉSERVATIONS


router.get('/reservations', checkTokenCookie, async (req, res) => {
  try {
    // 1️⃣ Tentative : route API globale
    try {
      const respGlobal = await axios.get('http://localhost:3003/api/reservations', {
        headers: { Authorization: `Bearer ${req.token}` }
      });

      return res.render('reservations', {
        user: req.user,
        reservations: respGlobal.data,
        error: null
      });
    } catch {
      // Fallback vers agrégation
    }

    // 2️⃣ Agrégation manuelle
    const catwaysResp = await axios.get('http://localhost:3003/api/catways', {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    const catways = catwaysResp.data || [];

    const reservationsPromises = catways.map(c =>
      axios
        .get(`http://localhost:3003/api/catways/${encodeURIComponent(c.catwayNumber || c._id)}/reservations`, {
          headers: { Authorization: `Bearer ${req.token}` }
        })
        .then(r => r.data)
        .catch(e => {
          console.error(
            `Erreur récupération réservations catway ${c.catwayNumber || c._id}:`,
            e.response ? e.response.data : e.message
          );
          return [];
        })
    );

    const nested = await Promise.all(reservationsPromises);
    const reservations = nested.flat().map(r => ({ ...r }));

    res.render('reservations', {
      user: req.user,
      reservations,
      error: null
    });
  } catch (err) {
    console.error(
      'Erreur récupération globale des réservations :',
      err.response ? err.response.data : err.message
    );

    res.render('reservations', {
      user: req.user,
      reservations: [],
      error: 'Impossible de charger les réservations.'
    });
  }
});

module.exports = router;
