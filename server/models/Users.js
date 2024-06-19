const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nomAbonnement: String,
    cout: Number,
    period: String,
    dateDebut: String
})

const Usermodel = mongoose.model("users", UserSchema)
module.exports = Usermodel