const express = require('express');
const { register, login, logout, getUserInfo } = require('../controlleurs/utilisateurControlleur');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/info', getUserInfo);

module.exports = router;
