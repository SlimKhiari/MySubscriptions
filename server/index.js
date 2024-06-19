const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Abonnementmodel = require('./models/Abonnements')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/subscriptions_octopuslabs")

app.get("/", (req,res) =>{
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
        nomAbonnement: req.body.nom, 
        cout: req.body.cout, 
        period: req.body.period,
        dateDebut: req.body.dateDebut
    })
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    Abonnementmodel.findByIdAndDelete({_id:id}, {
        nomAbonnement: req.body.nom, 
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

app.listen(3001, () => {
    console.log("Server is Running.")
})
