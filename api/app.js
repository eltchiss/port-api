/*
App.js : point d’entrée de l’application Express.
- Initialise la connexion MongoDB
- Active CORS et les middlewares essentiels
- Monte les routes de l’API (users, catways)
- Fournit une route d’accueil "/" simple (message JSON temporaire)
- Gère les erreurs 404
*/

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const mongodb = require('./db/mongo');

// Connexion à MongoDB
mongodb.initClientDbConnection();

const app = express();

// Middlewares globaux
app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*',
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- Import des routes ---
const indexRouter = require('./routes/index');    // Page d’accueil ou info API
const userRouter = require('./routes/users');     // Routes Users
const catwayRouter = require('./routes/catway'); // Routes Catways

// --- Déclaration des routes ---
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/catways', catwayRouter);

// --- Gestion des routes inexistantes ---
app.use((req, res) => {
  res.status(404).json({
    name: 'API Capitainerie',
    version: '1.0',
    status: 404,
    message: 'Route non trouvée',
  });
});

module.exports = app;
