const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const service = require('../services/users');
const private = require('../middlewares/private');

router.post('/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await service.getByEmailRaw(email); // fonction à créer dans le service

    if (!user) {
      return res.render('index', { error: 'Utilisateur non trouvé' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('index', { error: 'Mot de passe incorrect' });
    }

    // Génère le token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'superSecretKey',
      { expiresIn: '1h' }
    );

    // Stocke le token dans un cookie
    res.cookie('token', token, { httpOnly: true });

    // ✅ Redirige vers le tableau de bord
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('index', { error: 'Erreur serveur' });
  }
});

module.exports = router;
