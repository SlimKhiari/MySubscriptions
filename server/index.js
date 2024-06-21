const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken');
//import cookieParser from 'cookie-parser'

const Abonnementmodel = require('./models/Abonnements')
const Utilisateurmodel = require('./models/Utilisateurs')

const app = express()
app.use(cors({
    origin: ["http://localhost:5174"],
    credentials: true
}))
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/subscriptions_octopuslabs")

const verifyUser = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken) {

    } else {
        jwt.verify(accessToken, 'jwt-access-token-secret-key', (err, decoded) => {
            if(err) {
                return res.json({valid: false, message: "Invalid Token"})
            } else {
                req.email = decoded.email;
                next()
            }
        })
    }
}

const renewToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        return res.json({valid: false, message: "No refresh token"})
    } else {
        jwt.verify(refreshToken, 'jwt-refresh-token-secret-key', (err, decoded) => {
            if(err) {
                return res.json({valid: false, message: "Invalid Refresh Token"})
            } else {
                const accessToken = jwt.sign({email: email}, 
                    "jwt-access-token-secret-key", {expiresIn: '1m'})
                res.cookie('accessToke', accessToken, {maxAge: 60000})
            }
        })
    }
}
 

app.get("/dashboard", (req,res) =>{
    Abonnementmodel.find()
    .then(abonnements => res.json(abonnements))
    .catch(err => res.json(err))
})

app.get('/get/:id', (req,res) => {
     const id = req.params.id;
     Abonnementmodel.findById({_id:id})
     .then(abonnements => res.json(abonnements))
     .catch(err => res.json(err))
})

app.put('/update/:id', (req,res) => {
    const id = req.params.id;
    Abonnementmodel.findByIdAndUpdate({_id:id}, {
        nom: req.body.nom, 
        cout: req.body.cout, 
        period: req.body.period,
        dateDebut: req.body.dateDebut
    })
    .then(abonnements => res.json(abonnements))
    .catch(err => res.json(err))
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    Abonnementmodel.findByIdAndDelete({_id:id}, {
        nom: req.body.nom, 
        cout: req.body.cout, 
        period: req.body.period,
        dateDebut: req.body.dateDebut})
    .then(abonnements => res.json(abonnements))
    .catch(err => res.json(err))
})

app.post("/create", (req,res) => {
    Abonnementmodel.create(req.body)
    .then(abonnements => res.json(abonnements))
    .catch(err => res.json(err))
})

app.post("/register", (req,res) => {
    Utilisateurmodel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

app.post("/login", (req,res) => {
    const {email, password} = req.body;
    Utilisateurmodel.findOne({email})
    .then(user => {
        if(user){
            if(user.password === password){
                const accessToken = jwt.sign({email: email}, 
                    "jwt-access-token-secret-key", {expiresIn: '1m'})
                const refreshToken = jwt.sign({email: email}, 
                    "jwt-refresh-token-secret-key", {expiresIn: '5m'})

                res.cookie('accessToke', accessToken, {maxAge: 60000})
                
                res.cookie('refreshToken', refreshToken, 
                    {maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict'})       
        
                return res.json({Login: true})
            }
        } else {
            res.json({Login: false, Message: "no record"})
        }
    }).catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("Server is Running.")
})
