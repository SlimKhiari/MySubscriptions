import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Nouvel état pour gérer le succès

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/utilisateurs/reset-password', {
        email,
        nomUtilisateur,
        newPassword: nouveauMotDePasse,
      });
      setMessage(response.data.message);
      setSuccess(true); // Définir success à true en cas de succès
      setLoading(false);
    } catch (error) {
      setMessage('Une erreur est survenue lors de la réinitialisation du mot de passe.');
      setSuccess(false); // Définir success à false en cas d'erreur
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-white vh-100">
      <div className="bg-light p-4 rounded shadow-lg w-100 w-md-75 w-lg-50" style={{ maxWidth: '600px' }}>
        <h2 className="mb-4 text-center">Réinitialisez votre mot de passe !</h2>
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
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nomUtilisateur" className="form-label">
              <strong>Nom d'utilisateur</strong>
            </label>
            <input
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              autoComplete="off"
              name="nomUtilisateur"
              className="form-control rounded-0"
              value={nomUtilisateur}
              onChange={(e) => setNomUtilisateur(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nouveauMotDePasse" className="form-label">
              <strong>Nouveau Mot de Passe</strong>
            </label>
            <input
              type="password"
              placeholder="Entrez votre nouveau mot de passe"
              autoComplete="off"
              name="nouveauMotDePasse"
              className="form-control rounded-0"
              value={nouveauMotDePasse}
              onChange={(e) => setNouveauMotDePasse(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0" disabled={loading}>
            {loading ? 'Chargement...' : 'Je réinitialise mon mot de passe'}
          </button>
          {message && (
            <div className={`mt-2 text-${success ? 'success' : 'danger'}`}>
              {message}
            </div>
          )}
        </form>
        <Link to="/login" className="btn btn-outline-secondary w-100 mt-3 rounded-0 text-decoration-none">
          Je me connecte
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
