const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const mongodb = require('./db/mongo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); 

mongodb.initClientDbConnection();

const app = express();

app.use(cors({ origin: '*', exposedHeaders: ['Authorization'] }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

require('./swagger')(app);

// --- Routes API ---
const usersRouter = require('./routes/users');
const catwayRouter = require('./routes/catway');
app.use('/api/users', usersRouter);
app.use('/api/catways', catwayRouter);


// --- Pages frontend ---
const pageRouter = require('./routes/pages');
app.use('/', pageRouter);

// Secret JWT fallback
const SECRET = process.env.SECRET_KEY || 'superSecretKey';

// --- Route de connexion vers dashboard (formulaire POST depuis /) ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Tentative de connexion pour :', email);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.render('index', { error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render('index', { error: 'Mot de passe incorrect' });

    // Crée un token JWT valide 24h avec payload utilisateur
    const payloadUser = { _id: user._id, username: user.username || user.name, email: user.email };
    const token = jwt.sign({ user: payloadUser }, SECRET, { expiresIn: 24 * 60 * 60 });

    // Met le token dans un cookie HTTP Only nommé 'token'
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24h en ms
      sameSite: 'lax'
    });

    // Redirige vers le tableau de bord
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.status(500).render('index', { error: 'Erreur serveur.' });
  }
});

// --- Gestion 404 ---
app.use((req, res) => {
  res.status(404).json({
    name: 'API Capitainerie',
    version: '1.0',
    status: 404,
    message: 'Route non trouvée',
  });
});

module.exports = app;
