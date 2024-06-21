const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nom: String,
    email: String,
    motDePasse: String
})

const Utilisateurmodel = mongoose.model("utilisateurs", UserSchema)
module.exports = Utilisateurmodel