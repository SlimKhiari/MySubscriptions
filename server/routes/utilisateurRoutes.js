const express = require('express');
const { register, login, logout, getUserInfo, resetPassword} = require('../controlleurs/utilisateurControlleur');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/info', getUserInfo);
router.post('/reset-password', resetPassword);

module.exports = router;
