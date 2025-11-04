const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const service = require('../services/users');

// Lister tous les utilisateurs
router.get('/', private.checkJWT, service.getAll);

// Récupérer un utilisateur par email
router.get('/:email', private.checkJWT, service.getByEmail);

// Créer un nouvel utilisateur
router.post('/', service.add);

// Mettre à jour un utilisateur
router.put('/:email', private.checkJWT, service.update);

// Supprimer un utilisateur
router.delete('/:email', private.checkJWT, service.delete);

module.exports = router;
