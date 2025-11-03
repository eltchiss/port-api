/*
On utilise le routeur d'express pour définir 4 routes.
On exprime ici ce qu'on appelle un CRUD pou Create, Read, Update, Delete
Pour déclarer une route dans express : app.verbeHttp(route, fonction)
Ici on utilise le router pour appeler le verbe Http
router.get('/:id', service.getById);
le callback sera fourni par un service qu'on va déclarer
Recourir à des services permet de structurer le projet et séparer les diverses logiques
On pourra se resservir de ces mêmes services pour d'autres entités que users
*/
const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const service = require('../services/users');

// Lister tous les utilisateurs
router.get('/', private.checkJWT, service.getAll);

// Récupérer un utilisateur par email
router.get('/:email', private.checkJWT, service.getByEmail);

// Créer un utilisateur
router.post('/', service.add);

// Modifier un utilisateur par email
router.put('/:email', private.checkJWT, service.update);

// Supprimer un utilisateur par email
router.delete('/:email', private.checkJWT, service.delete);

// Authentification
router.post('/authenticate', service.authenticate);

module.exports = router;