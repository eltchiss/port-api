const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const service = require('../services/users');

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs (création, lecture, mise à jour, suppression)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 */
router.get('/', private.checkJWT, service.getAll);

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Récupère un utilisateur par son adresse email
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Adresse email de l'utilisateur à rechercher
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:email', private.checkJWT, service.getByEmail);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crée un nouvel utilisateur (inscription)
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', service.add);

/**
 * @swagger
 * /api/users/{email}:
 *   put:
 *     summary: Met à jour les informations d’un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Adresse email de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:email', private.checkJWT, service.update);

/**
 * @swagger
 * /api/users/{email}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Adresse email de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:email', private.checkJWT, service.delete);

module.exports = router;
