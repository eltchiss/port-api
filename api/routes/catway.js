const express = require('express');
const router = express.Router();

const private = require('../middlewares/private');
const service = require('../services/catways');

// Lire tous les catways
router.get('/', private.checkJWT, service.getAll);

// Lire un catway par son id
router.get('/:id', private.checkJWT, service.getById);

// Ajouter un nouveau catway
router.put('/add', private.checkJWT, service.add);

// Modifier l’état d’un catway (uniquement catwayState)
router.patch('/:id', private.checkJWT, service.updateState);

// Supprimer un catway
router.delete('/:id', private.checkJWT, service.delete);

module.exports = router;
