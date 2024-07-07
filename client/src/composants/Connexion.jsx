import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Connexion = () => {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotdepasse] = useState("");
    const [estChargement, setEstchargement] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const validate = () => {
        const errors = {};
        if (!email) errors.email = "L'email est requis";
        if (!motDePasse) errors.motDePasse = "Le mot de passe est requis";
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setEstchargement(true);
            axios.post('http://localhost:3001/api/utilisateurs/login', { email, motDePasse })
                .then(res => {
                    setEstchargement(false);
                    if (res.data.Login) {
                        console.log(res.data);
                        navigate("/dashboard");
                    } else {
                        setMessage(res.data.Message);
                    }
                })
                .catch(err => {
                    setEstchargement(false);
                    console.log(err);
                });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-white vh-100">
            <div className="bg-light p-4 rounded shadow-lg w-100 w-md-75 w-lg-50" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4 text-center">Connectez-vous facilement !</h2>
                <form onSubmit={handleSubmit}>
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
                            onChange={(e) => setMotdepasse(e.target.value)}
                        />
                        {errors.motDePasse && <div className="invalid-feedback">{errors.motDePasse}</div>}
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0" disabled={estChargement}>
                        {estChargement ? "Chargement..." : "Je me connecte"}
                    </button>
                    {message && <div className="text-danger mt-2">{message}</div>}
                </form>
                <Link to="/" className="btn btn-outline-secondary w-100 mt-3 rounded-0 text-decoration-none">
                    Je crée mon compte
                </Link>
                <Link to="/reset-password" className="btn btn-link w-100 mt-3 rounded-0 text-decoration-none">
                    Mot de passe oublié ?
                </Link>
            </div>
        </div>
    );
};

export default Connexion;
