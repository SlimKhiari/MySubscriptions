import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Abonnements() {
    const [abonnements, setAbonnements] = useState([]);
    const navigate = useNavigate();

    const [modeSombre, setModeSombre] = useState(() => {
        const modeSombreLocal = localStorage.getItem('modeSombre');
        return modeSombreLocal ? JSON.parse(modeSombreLocal) : false;
    });

    const toggleModeSombre = () => {
        const newModeSombre = !modeSombre;
        setModeSombre(newModeSombre);
        localStorage.setItem('modeSombre', JSON.stringify(newModeSombre));
    };
    
    useEffect(() => {
        document.body.classList.toggle('dark-mode', modeSombre);
    }, [modeSombre]);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/api/abonnements/dashboard")
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
        axios.delete('http://localhost:3001/api/abonnements/delete/' + id)
            .then(res => {
                setAbonnements(abonnements.filter(user => user._id !== id));
            })
            .catch(err => console.log(err));
    };

    const handleLogout = () => {
        axios.post('http://localhost:3001/api/utilisateurs/logout', {}, { withCredentials: true })
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
            <nav className={`navbar navbar-expand-lg ${modeSombre ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/dashboard" style={{ color: modeSombre ? 'white' : 'black' }}>MySubscriptions</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <div className="form-check form-switch ms-auto">
                            <input className="form-check-input" type="checkbox" id="darkModeSwitch" checked={modeSombre} onChange={toggleModeSombre} />
                            <label className="form-check-label" htmlFor="darkModeSwitch" style={{ color: modeSombre ? 'white' : 'black' }}>
                                {modeSombre ? 'Désactiver le mode sombre' : 'Activer le mode sombre'}
                            </label>
                        </div>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button onClick={handleLogout} className="btn btn-danger">Je me déconnecte</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Contenu de la page */}
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className='col-lg-8'>
                        <div className={`card shadow-lg border-0 rounded-lg mt-5 ${modeSombre ? 'bg-dark text-white' : 'bg-light'}`}>
                            <div className='card-header d-flex justify-content-between align-items-center'>
                                <h3 className='text-center font-weight-light my-4'>Mes abonnements !</h3>
                                <Link to="/create" className='btn btn-primary'>+</Link>
                            </div>
                            <div className={`card-body ${modeSombre ? 'text-white' : 'text-dark'}`}>
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>Nom</th>
                                            <th className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>Coût</th>
                                            <th className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>Période</th>
                                            <th className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>Date de début de facturation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            abonnements.map((abonnement) => (
                                                <tr key={abonnement._id}>
                                                    <td className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>{abonnement.nom}</td>
                                                    <td className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>{abonnement.cout}</td>
                                                    <td className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>{abonnement.period}</td>
                                                    <td className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>{new Date(abonnement.dateDebut).toLocaleDateString()}</td>
                                                    <td className={`table-cell ${modeSombre ? 'table-dark text-white' : 'table-light'}`}>
                                                        <Link to={`/update/${abonnement._id}`} className='btn btn-sm me-2'>
                                                            <img src="../update_logo.png" alt="Update" style={{ width: '20px', height: '20px' }} />
                                                        </Link>
                                                        <button className='btn btn-sm' onClick={() => handleDelete(abonnement._id)}>
                                                            <img src="../delete_logo.png" alt="Delete" style={{ width: '20px', height: '20px' }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Abonnements;

