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
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

//POST /login 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Créer le token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET /logout
router.get('/logout', private.checkJWT, (req, res) => {
  // Dans une vraie appli, on pourrait invalider le token (liste noire, etc.)
  // Mais ici la consigne veut simplement une route pour déconnexion :
  res.status(200).json({ message: 'Déconnexion réussie' });
});


module.exports = router;