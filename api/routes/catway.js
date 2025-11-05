const express = require('express');
const router = express.Router();

const private = require('../middlewares/private');
const service = require('../services/catways');
const reservationService = require('../services/reservations');
const catwayService = require('../services/catways');

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des postes d'amarrage (catways)
 */

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways récupérée avec succès
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/', private.checkJWT, service.getAll);

/**
 * @swagger
 * /api/catways/{id}:
 *   get:
 *     summary: Récupère un catway spécifique
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway à récupérer
 *     responses:
 *       200:
 *         description: Catway trouvé
 *       404:
 *         description: Catway non trouvé
 */
router.get('/:id', private.checkJWT, service.getById);

/**
 * @swagger
 * /api/catways:
 *   post:
 *     summary: Crée un nouveau catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayNumber
 *               - catwayType
 *               - catwayState
 *             properties:
 *               catwayNumber:
 *                 type: number
 *               catwayType:
 *                 type: string
 *                 enum: [long, short]
 *               catwayState:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', private.checkJWT, service.add);

/**
 * @swagger
 * /api/catways/{id}:
 *   put:
 *     summary: Met à jour l’état d’un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catway mis à jour avec succès
 *       404:
 *         description: Catway non trouvé
 */
router.put('/:id', private.checkJWT, service.updateState);

/**
 * @swagger
 * /api/catways/{id}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catway supprimé
 *       404:
 *         description: Catway non trouvé
 */
router.delete('/:id', private.checkJWT, service.delete);


/* Sous-routes : Réservations */

/**
 * @swagger
 * tags:
 *   name: Réservations
 *   description: Gestion des réservations liées à un catway
 */

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   get:
 *     summary: Liste toutes les réservations pour un catway
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get('/:id/reservations', private.checkJWT, reservationService.getAllByCatway);

/**
 * @swagger
 * /api/catways/{id}/reservations/{reservationId}:
 *   get:
 *     summary: Récupère les détails d’une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation trouvée
 */
router.get('/:id/reservations/:reservationId', private.checkJWT, reservationService.getById);

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   post:
 *     summary: Crée une réservation pour un catway
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 */
router.post('/:id/reservations', private.checkJWT, reservationService.add);

/**
 * @swagger
 * /api/catways/{id}/reservations/{reservationId}:
 *   put:
 *     summary: Met à jour une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 */
router.put('/:id/reservations/:reservationId', private.checkJWT, reservationService.update);

/**
 * @swagger
 * /api/catways/{id}/reservations/{reservationId}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée
 */
router.delete('/:id/reservations/:reservationId', private.checkJWT, reservationService.delete);

module.exports = router;
