const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY || 'superSecretKey';

// Lister tous les utilisateurs
exports.getAll = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Récupérer un utilisateur par email (route API - renvoie JSON)
exports.getByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }, '-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Récupérer un utilisateur par email **brut** (retourne l'objet user, utile pour réutilisation)
exports.getByEmailRaw = async (email) => {
  return await User.findOne({ email });
};

// Créer un utilisateur (avec hash du mot de passe)
exports.add = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });

    // On retire le mot de passe de la réponse
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: userResponse });
  } catch (error) {
    res.status(400).json(error);
  }
};

// Modifier un utilisateur
exports.update = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    const userResponse = { _id: user._id, username: user.username, email: user.email };
    res.status(200).json({ message: 'Utilisateur mis à jour', user: userResponse });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Supprimer un utilisateur
exports.delete = async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ email: req.params.email });
    if (!result) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Authentification (API -> renvoie token JSON)
exports.authenticate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: 'user_not_found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ message: 'wrong_credentials' });

    // retire le mot de passe avant de renvoyer l'objet user
    const userPayload = {
      _id: user._id,
      username: user.username,
      email: user.email
    };

    const expiresIn = 24 * 60 * 60; // 24h en secondes
    const token = jwt.sign({ user: userPayload }, SECRET, { expiresIn });

    // renvoyer le token dans le header et le body
    res.header('Authorization', 'Bearer ' + token);
    return res.status(200).json({ message: 'authenticate_succeed', token, user: userPayload });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
