import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function AjouterAbonnement() {
    const [nom, setName] = useState("");
    const [cout, setCout] = useState();
    const [period, setPeriod] = useState("Mensuel");
    const [dateDebut, setDateDebut] = useState(new Date());
    const [email, setEmail] = useState("test@test.com");
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

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/api/abonnements/dashboard")
            .then(result => {
                console.log(result.data)
                if (!result.data.valid) {
                    navigate("/");
                } else {
                    setEmail(result.data.email);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const Submit = (e) => {
        e.preventDefault();
        const formattedDate = `${dateDebut.getFullYear()}-${(dateDebut.getMonth() + 1).toString().padStart(2, '0')}-${dateDebut.getDate().toString().padStart(2, '0')}`;
        axios.post("http://localhost:3001/api/abonnements/create", { nom, cout, period, dateDebut: formattedDate, email })
            .then(result => {
                console.log(result);
                navigate("/dashboard");
            })
            .catch(err => console.log(err));
    };

    const handleCostChange = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
            value = 0;
        }
        setCout(value);
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
                    <div className='row justify-content-center'>
                        <div className='col-lg-6'>
                            <div className={`card shadow-lg border-0 rounded-lg mt-5 ${modeSombre ? 'bg-dark text-white' : 'bg-light'}`}>
                                <div className='card-header'>
                                    <h3 className='text-center font-weight-light my-4'>Mon nouveau abonnement !</h3>
                                </div>
                                <div className='card-body'>
                                    <form onSubmit={Submit}>
                                        <div className='mb-3'>
                                            <label className='form-label'>Nom</label>
                                            <input
                                                type='text'
                                                className={`form-control ${modeSombre ? 'text-white bg-dark' : 'bg-light'}`}
                                                id='nom'
                                                value={nom}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='form-label'>Coût</label>
                                            <input
                                                type='number'
                                                className={`form-control ${modeSombre ? 'text-white bg-dark' : 'bg-light'}`}
                                                id='cout'
                                                value={cout}
                                                onChange={handleCostChange}
                                                required
                                            />
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='period'>Période</label>
                                            <select
                                                className={`form-select ${modeSombre ? 'text-white bg-dark' : 'bg-light'}`}
                                                id='period'
                                                value={period}
                                                onChange={(e) => setPeriod(e.target.value)}
                                                required
                                            >
                                                <option value='Mensuel'>Mensuel</option>
                                                <option value='Annuel'>Annuel</option>
                                            </select>
                                        </div>
                                        <div className='mb-2'>
                                            <label htmlFor='dateDebut'>Date de début de facturation</label>
                                            <DatePicker
                                                selected={dateDebut}
                                                onChange={date => setDateDebut(date)}
                                                className={`form-control ${modeSombre ? 'text-white bg-dark' : 'bg-light'}`}
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                        <div className='d-flex align-items-center justify-content-center mt-4 mb-0'>
                                            <button type='submit' className='btn btn-primary'>J'ajoute</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default AjouterAbonnement;

