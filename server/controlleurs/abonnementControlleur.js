const Abonnementmodel = require('../models/Abonnements');

const getDashboard = (req, res) => {
    Abonnementmodel.find({ email: req.email })
        .then(abonnements => res.json({ valid: true, abonnements: abonnements, email: req.email }))
        .catch(err => res.json({ valid: false, error: err }));
};

const getAbonnementById = (req, res) => {
    const id = req.params.id;
    Abonnementmodel.findById({ _id: id })
        .then(abonnement => res.json(abonnement))
        .catch(err => res.json(err));
};

const createAbonnement = (req, res) => {
    Abonnementmodel.create(req.body)
        .then(abonnement => res.json(abonnement))
        .catch(err => res.json(err));
};

const updateAbonnement = (req, res) => {
    const id = req.params.id;
    Abonnementmodel.findByIdAndUpdate({ _id: id }, req.body)
        .then(abonnement => res.json(abonnement))
        .catch(err => res.json(err));
};

const deleteAbonnement = (req, res) => {
    const id = req.params.id;
    Abonnementmodel.findByIdAndDelete({ _id: id })
        .then(abonnement => res.json(abonnement))
        .catch(err => res.json(err));
};

module.exports = {
    getDashboard,
    getAbonnementById,
    createAbonnement,
    updateAbonnement,
    deleteAbonnement
};
