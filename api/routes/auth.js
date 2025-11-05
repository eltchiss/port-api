const express = require('express');
const router = express.Router();
const authService = require('../services/auth');

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification (connexion)
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "motdepasse123"
 *     responses:
 *       200:
 *         description: Authentification réussie, retourne le token et les infos utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: authenticate_succeed
 *                 token:
 *                   type: string
 *                   description: JWT pour les requêtes suivantes
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       403:
 *         description: Mauvais identifiants (mot de passe incorrect)
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', authService.authenticate);

module.exports = router;
