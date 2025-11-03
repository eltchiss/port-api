const express = require('express');
const router = express.Router();
// 🛑 Importez le middleware de protection JWT
const private = require('../middlewares/private'); 

// Page d'accueil (Non protégée)
// Elle vérifie si l'utilisateur est déjà connecté via un token (si le middleware est appliqué avant)
router.get('/', (req, res) => {
    // Si le token est valide, req.decoded est rempli. Sinon, il est null ou undefined.
    // L'index.ejs doit gérer l'affichage du formulaire ou d'un lien vers le tableau de bord
    res.render('index', { 
        title: 'Accueil - Capitainerie',
        user: req.decoded ? req.decoded.user : null 
    });
});

// ===================================
// Pages Protégées (Nécessite un JWT valide)
// ===================================

// Tableau de bord
router.get('/dashboard', private.checkJWT, (req, res) => {
    // Le middleware private.checkJWT garantit que l'utilisateur est authentifié et que req.decoded existe.
    res.render('dashboard', {
        title: 'Tableau de Bord',
        user: req.decoded.user, // Information utilisateur extraite du Token
        date: new Date().toLocaleDateString('fr-FR'),
    });
});

// Pages CRUD Catways
router.get('/catways', private.checkJWT, (req, res) => {
    res.render('catways', { 
        title: 'Gestion des Catways',
        user: req.decoded.user 
    });
});

// Pages CRUD Réservations
router.get('/reservations', private.checkJWT, (req, res) => {
    res.render('reservations', { 
        title: 'Gestion des Réservations',
        user: req.decoded.user 
    });
});

// Pages CRUD Utilisateurs
router.get('/users', private.checkJWT, (req, res) => {
    res.render('users', { 
        title: 'Gestion des Utilisateurs',
        user: req.decoded.user 
    });
});

module.exports = router;
