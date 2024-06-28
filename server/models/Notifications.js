const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userEmail: String,
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const NotificationModel = mongoose.model("notifications", NotificationSchema);
module.exports = NotificationModel;
