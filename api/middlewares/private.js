// middlewares/private.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = (req, res, next) => {
  try {
    let token = req.headers['authorization'] || req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ message: 'token_required' });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    // stocke l'utilisateur décodé pour usage ultérieur
    req.user = decoded.user || decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'token_not_valid' });
  }
};
