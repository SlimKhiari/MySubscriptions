const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const Abonnementmodel = require('./models/Abonnements');
const Utilisateurmodel = require('./models/Utilisateurs');

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/subscriptions_octopuslabs");

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
        return true; // Le renouvellement du token a réussi
    });
};

app.get("/dashboard", verifyUser, (req, res) => {
    Abonnementmodel.find({ email: req.email }) // Utilisez l'email de l'utilisateur connecté pour filtrer les abonnements
        .then(abonnements => {
            res.json({ valid: true, abonnements: abonnements, email: req.email });
        })
        .catch(err => {
            res.json({ valid: false, error: err });
        });
});

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    Abonnementmodel.findById({ _id: id })
        .then(abonnements => res.json(abonnements))
        .catch(err => res.json(err));
});

app.put('/update/:id', verifyUser, (req, res) => {
    const id = req.params.id;
    Abonnementmodel.findByIdAndUpdate({ _id: id }, {
        nom: req.body.nom,
        cout: req.body.cout,
        period: req.body.period,
        dateDebut: req.body.dateDebut
    })
        .then(abonnements => res.json(abonnements))
        .catch(err => res.json(err));
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    Abonnementmodel.findByIdAndDelete({ _id: id }, {
        nom: req.body.nom,
        cout: req.body.cout,
        period: req.body.period,
        dateDebut: req.body.dateDebut
    })
        .then(abonnements => res.json(abonnements))
        .catch(err => res.json(err));
});

app.post("/create", verifyUser, (req, res) => {
    Abonnementmodel.create(req.body)
        .then(abonnements => res.json(abonnements))
        .catch(err => res.json(err));
});

app.post("/register", (req, res) => {
    const { email, motDePasse } = req.body;

    Utilisateurmodel.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({ valid: false, message: "Email already exists" });
            } else {
                Utilisateurmodel.create(req.body)
                    .then(newUser => res.status(201).json({ valid: true, user: newUser }))
                    .catch(err => res.status(500).json({ valid: false, error: err }));
            }
        }).catch(err => res.status(500).json({ valid: false, error: err }));
});



app.post("/login", (req, res) => {
    const { email, motDePasse } = req.body;
    
    // Log pour vérifier que la requête est bien reçue
    console.log('Tentative de connexion:', email);
    
    Utilisateurmodel.findOne({ email })
        .then(user => {
            if (user) {
                if (user.motDePasse === motDePasse) { 
                    const accessToken = jwt.sign({ email: email },
                        "jwt-access-token-secret-key", { expiresIn: '1m' });
                    const refreshToken = jwt.sign({ email: email },
                        "jwt-refresh-token-secret-key", { expiresIn: '5m' });

                    res.cookie('accessToken', accessToken, { maxAge: 60000 });

                    res.cookie('refreshToken', refreshToken,
                        { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' });

                    console.log('Connexion réussie:', email);
                    return res.json({ Login: true });
                } else {
                    console.log('Mot de passe incorrect pour:', email);
                    return res.json({ Login: false, Message: "Invalid password" });
                }
            } else {
                console.log('Utilisateur non trouvé:', email);
                return res.json({ Login: false, Message: "Veuillez créer votre compte." });
            }
        }).catch(err => {
            console.error('Erreur lors de la tentative de connexion:', err);
            res.json(err);
        });
});

// Endpoint de déconnexion
app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Déconnexion réussie' });
});


app.listen(3001, () => {
    console.log("Server is Running.");
});
