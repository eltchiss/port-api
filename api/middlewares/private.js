const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; 



exports.checkJWT = async (req, res, next) => {
    // Lire le token depuis le header ou le cookie
    let token = req.headers['x-access-token'] 
                || req.headers['authorization'] 
                || req.cookies['Authorization'];

    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                // Token invalide
                if (req.originalUrl.includes('/api/')) {
                    return res.status(401).json('token_not_valid');
                } else {
                    return res.redirect('/'); // Redirection pour pages EJS
                }
            } else {
                req.decoded = decoded; // Infos utilisateur disponibles dans req.decoded
                next();
            }
        });
    } else {
        // Token manquant
        if (req.originalUrl.includes('/api/')) {
            return res.status(401).json('token_required');
        } else {
            return res.redirect('/'); // Redirection pour pages EJS
        }
    }
};
