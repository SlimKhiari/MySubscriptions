const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const abonnementRoutes = require('./routes/abonnementRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/subscriptions_octopuslabs");

app.use('/api/abonnements', abonnementRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(3001, () => {
    console.log("Server is Running.");
});