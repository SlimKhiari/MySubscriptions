import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Abonnements() {
    const [abonnements, setAbonnements] = useState([]);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/dashboard")
            .then(result => {
                if(result.data.valid) {
                    setAbonnements(result.data.abonnements);
                } else {
                    navigate("/");
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/delete/' + id)
            .then(res => {
                setAbonnements(abonnements.filter(user => user._id !== id));
            })
            .catch(err => console.log(err));
    };

    const handleLogout = () => {
        axios.post('http://localhost:3001/logout', {}, { withCredentials: true })
            .then(res => {
                console.log(res.data.message);
                navigate('/login');
            })
            .catch(err => {
                console.error('Erreur lors de la déconnexion:', err);
            });
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/dashboard">MySubscriptions</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/create">Créer un abonnement</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="btn btn-danger">Se déconnecter</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Contenu de la page */}
            <div className="container mt-5">
                <div className='row justify-content-center'>
                    <div className='col-lg-8'>
                        <div className='card shadow-lg border-0 rounded-lg mt-5'>
                            <div className='card-header d-flex justify-content-between align-items-center'>
                                <h3 className='text-center font-weight-light my-4'>Mes abonnements !</h3>
                            </div>
                            <div className='card-body'>
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Coût</th>
                                            <th>Période</th>
                                            <th>Date de début de facturation</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            abonnements.map((abonnement) => (
                                                <tr key={abonnement._id}>
                                                    <td>{abonnement.nom}</td>
                                                    <td>{abonnement.cout}</td>
                                                    <td>{abonnement.period}</td>
                                                    <td>{new Date(abonnement.dateDebut).toLocaleDateString()}</td>
                                                    <td>
                                                        <Link to={`/update/${abonnement._id}`} className='btn btn-sm me-2'>
                                                            <img src="../public/update_logo.jpg" alt="Update" style={{ width: '20px', height: '20px' }} />
                                                        </Link>
                                                        <button className='btn btn-sm' onClick={() => handleDelete(abonnement._id)}>
                                                            <img src="../public/delete_logo.png" alt="Delete" style={{ width: '20px', height: '20px' }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='card-footer text-center'>
                                <Link to="/create" className='btn btn-primary'>+</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Abonnements;

