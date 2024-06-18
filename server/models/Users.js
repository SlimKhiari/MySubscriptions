const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
})

const Usermodel = mongoose.model("users", UserSchema)
module.exports = Usermodel