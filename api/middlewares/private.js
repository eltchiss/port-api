const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY; 

exports.checkJWT = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    // Si la requête vient du navigateur, le token n'est pas dans le header
    // mais devrait être dans un cookie (approche recommandée) ou un paramètre.
    // Pour l'instant, on se base sur le header (le client doit le fournir).

    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                // Si la vérification échoue, vérifions si c'est une requête de page ou d'API
                if (req.originalUrl.includes('/api/')) {
                    return res.status(401).json('token_not_valid');
                } else {
                    // C'est une page EJS : redirection vers l'accueil
                    return res.redirect('/'); 
                }
            } else {
                req.decoded = decoded;

                // Logique de rafraîchissement du token (que vous aviez déjà)
                const expiresIn = 24 * 60 * 60;
                const newToken = jwt.sign(
                    { user: decoded.user },
                    SECRET_KEY, 
                    { expiresIn: expiresIn }
                );

                res.header('Authorization', 'Bearer ' + newToken);
                next();
            }
        });
    } else {
        // Token manquant
        if (req.originalUrl.includes('/api/')) {
            return res.status(401).json('token_required');
        } else {
            // C'est une page EJS : redirection vers l'accueil
            return res.redirect('/');
        }
    }
};
