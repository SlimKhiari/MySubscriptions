const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nom: String,
    cout: Number,
    period: String,
    dateDebut: String
})

const Abonnementmodel = mongoose.model("abonnements", UserSchema)
module.exports = Abonnementmodel