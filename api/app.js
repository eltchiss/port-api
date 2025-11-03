/*
App.js : point d’entrée de l’application Express.
- Initialise la connexion MongoDB
- Active CORS et les middlewares essentiels
- Monte les routes de l’API (users, catways)
- Fournit les pages front-end via EJS
- Gère les erreurs 404
*/

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const mongodb = require('./db/mongo');

// Connexion à MongoDB
mongodb.initClientDbConnection();

const app = express();

// --- Middlewares globaux ---
app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*',
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- Config moteur de template ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Dossier public pour CSS / JS / images ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Import des routes API ---
const indexRouter = require('./routes/index');      // Accueil API
const userRouter = require('./routes/users');       // Routes Users + login/logout
const catwayRouter = require('./routes/catway');   // Routes Catways + Reservations

// --- Import des routes pages front ---
const pageRouter = require('./routes/pages');       // Pages CRUD + dashboard

// --- Déclaration des routes API ---
app.use('/api', indexRouter);       // Toutes les routes d'API accessibles sous /api
app.use('/api/users', userRouter);  // API Users
app.use('/api/catways', catwayRouter); // API Catways + Reservations

// --- Déclaration des routes front-end ---
app.use('/', pageRouter);           // Pages front (login, dashboard, CRUD)

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
