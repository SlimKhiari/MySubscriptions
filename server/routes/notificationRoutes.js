const express = require('express');
const router = express.Router();
const notificationControlleur = require('../controlleurs/notificationsControlleur');

router.get('/:email', notificationControlleur.getNotifications);
router.put('/:id/read', notificationControlleur.markAsRead);
router.post('/create', notificationControlleur.createNotification);

module.exports = router;

