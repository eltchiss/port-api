const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name: process.env.APP_NAME || 'API Capitainerie',
    version: '1.0',
    message: 'Bienvenue sur l’API Capitainerie',
  });
});

module.exports = router;
