const NotificationModel = require('../models/Notifications');

const getNotifications = (req, res) => {
    const userEmail = req.params.email;
    NotificationModel.find({ userEmail: userEmail })
        .then(notifications => res.json(notifications))
        .catch(err => res.status(500).json({ error: err.message }));
};

const markAsRead = (req, res) => {
    const id = req.params.id;
    NotificationModel.findByIdAndUpdate(id, { read: true }, { new: true })
        .then(notification => res.json(notification))
        .catch(err => res.status(500).json({ error: err.message }));
};

const createNotification = (req, res) => {
    const { userEmail, message } = req.body;
    const newNotification = new NotificationModel({
        userEmail,
        message
    });
    newNotification.save()
        .then(notification => res.json(notification))
        .catch(err => res.status(500).json({ error: err.message }));
};

module.exports = {
    getNotifications,
    markAsRead,
    createNotification
};

