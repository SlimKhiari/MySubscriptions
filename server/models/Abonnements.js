const mongoose = require('mongoose')

const AbonnementSchema = new mongoose.Schema({
    nom: String,
    cout: Number,
    period: String,
    dateDebut: String,
    email: String
})

const Abonnementmodel = mongoose.model("abonnements", AbonnementSchema)
module.exports = Abonnementmodel