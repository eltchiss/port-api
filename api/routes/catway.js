const express = require('express');
const router = express.Router();

const private = require('../middlewares/private');
const service = require('../services/catways');
const reservationService = require('../services/reservations');
const catwayService = require('../services/catways');

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



  //Sous-routes : RESERVATIONS (CRUD lié à un catway)
 

// Liste toutes les réservations d’un catway
router.get('/:id/reservations', private.checkJWT, reservationService.getAllByCatway);

// Détail d’une réservation spécifique
router.get('/:id/reservations/:reservationId', private.checkJWT, reservationService.getById);

// Créer une réservation
router.put('/:id/reservations/add', private.checkJWT, reservationService.add);

// Modifier une réservation
router.patch('/:id/reservations/:reservationId', private.checkJWT, reservationService.update);

// Supprimer une réservation
router.delete('/:id/reservations/:reservationId', private.checkJWT, reservationService.delete);

module.exports = router;
