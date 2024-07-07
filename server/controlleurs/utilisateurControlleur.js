const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateurmodel = require('../models/Utilisateurs');

const register = async (req, res) => {
    const { nom, email, motDePasse } = req.body;
    try {
        const existingUser = await Utilisateurmodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ valid: false, message: "L'adresse email est déjà existante." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);
        const newUser = new Utilisateurmodel({ nom, email, motDePasse: hashedPassword });
        await newUser.save();
        res.status(201).json({ valid: true, message: 'Utilisateur créé avec succès!' });
    } catch (error) {
        res.status(500).json({ valid: false, error: 'Une erreur est survenue lors de l\'inscription.' });
    }
};

const login = async (req, res) => {
    const { email, motDePasse } = req.body;
    try {
        const user = await Utilisateurmodel.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
            if (isMatch) {
                const accessToken = jwt.sign({ email: email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
                const refreshToken = jwt.sign({ email: email }, "jwt-refresh-token-secret-key", { expiresIn: '5m' });
                res.cookie('accessToken', accessToken, { maxAge: 60000 });
                res.cookie('refreshToken', refreshToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' });
                return res.json({ Login: true });
            } else {
                return res.json({ Login: false, Message: "Mot de passe incorrect." });
            }
        } else {
            return res.json({ Login: false, Message: "Veuillez créer votre compte." });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
    }
};

const getUserInfo = (req, res) => {
    const token = req.cookies['accessToken'];
    if (!token) {
        return res.status(401).json({ message: 'Token non fourni.' });
    }

    jwt.verify(token, "jwt-access-token-secret-key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide.' });
        }

        res.status(200).json({ email: decoded.email });
    });
};

const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Déconnexion réussie' });
};

module.exports = { register, login, logout, getUserInfo};