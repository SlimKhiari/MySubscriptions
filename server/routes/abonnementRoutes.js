const express = require('express');
const { getDashboard, getAbonnementById, createAbonnement, updateAbonnement, deleteAbonnement } = require('../controlleurs/abonnementControlleur');
const { verifyUser } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/dashboard', verifyUser, getDashboard);
router.get('/get/:id', getAbonnementById);
router.post('/create', verifyUser, createAbonnement);
router.put('/update/:id', verifyUser, updateAbonnement);
router.delete('/delete/:id', deleteAbonnement);

module.exports = router;
