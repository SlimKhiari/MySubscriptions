import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
    const [nom, setName] = useState("");
    const [email, setEmail] = useState("");
    const [motDePasse, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!nom) errors.nom = "Le nom est requis";
        if (!email) {
            errors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "L'email est invalide";
        }
        if (!motDePasse) errors.motDePasse = "Le mot de passe est requis";
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            axios.post('http://localhost:3001/register', { nom, email, motDePasse })
                .then(res => {
                    setIsLoading(false);
                    navigate('/login');
                })
                .catch(err => {
                    setIsLoading(false);
                    console.log(err);
                });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-white vh-100">
            <div className="bg-light p-4 rounded shadow-lg w-25">
                <h2 className="mb-4">Créez un compte rapidement !</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nom" className="form-label">
                            <strong>Nom</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Entrez votre nom"
                            autoComplete="off"
                            name="nom"
                            className={`form-control rounded-0 ${errors.nom ? 'is-invalid' : ''}`}
                            value={nom}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Entrez votre email"
                            autoComplete="off"
                            name="email"
                            className={`form-control rounded-0 ${errors.email ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="motDePasse" className="form-label">
                            <strong>Mot de passe</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            autoComplete="off"
                            name="motDePasse"
                            className={`form-control rounded-0 ${errors.motDePasse ? 'is-invalid' : ''}`}
                            value={motDePasse}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.motDePasse && <div className="invalid-feedback">{errors.motDePasse}</div>}
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0" disabled={isLoading}>
                        {isLoading ? "Chargement..." : "Je crée mon compte"}
                    </button>
                </form>
                <Link to="/login" className="btn btn-outline-secondary w-100 mt-3 rounded-0 text-decoration-none">
                    Je me connecte
                </Link>
            </div>
        </div>
    );
};

export default Registration;
