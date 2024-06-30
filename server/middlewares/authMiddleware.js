const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        if (!renewToken(req, res, next)) {
            return; // Arrête le processus si le renouvellement du token a échoué
        }
    } else {
        jwt.verify(accessToken, 'jwt-access-token-secret-key', (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: "Invalid Token" });
            } else {
                req.email = decoded.email;
                return next();
            }
        });
    }
};

const renewToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.json({ valid: false, message: "No refresh token" });
        return false; // Le renouvellement du token a échoué
    }
    jwt.verify(refreshToken, 'jwt-refresh-token-secret-key', (err, decoded) => {
        if (err) {
            res.json({ valid: false, message: "Invalid Refresh Token" });
            return false; // Le renouvellement du token a échoué
        }
        const accessToken = jwt.sign({ email: decoded.email }, 
            "jwt-access-token-secret-key", { expiresIn: '1m' });
        res.cookie('accessToken', accessToken, { maxAge: 60000 });
        req.accessTokenRenewed = true; // Indicateur pour le middleware suivant
        next()
        return true; // Le renouvellement du token a réussi
    });
};

module.exports = { verifyUser, renewToken };
