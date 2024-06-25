import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function MettreAjourAbonnement() {
    const { id } = useParams();
    const [nom, setName] = useState("");
    const [cout, setCout] = useState(0);
    const [period, setPeriod] = useState("Mensuel");
    const [dateDebut, setDateDebut] = useState(new Date());
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

    useEffect(() => {
        axios.get('http://localhost:3001/api/abonnements/get/' + id)
            .then(result => {
                console.log(result);
                setName(result.data.nom);
                setCout(result.data.cout);
                setPeriod(result.data.period);
                setDateDebut(new Date(result.data.dateDebut));
            })
            .catch(err => console.log(err));
    }, [id]);

    useEffect(() => {
        axios.get("http://localhost:3001/api/abonnements/dashboard")
            .then(result => {
                if (!result.data.valid) {
                    navigate("/login");
                }
            })
            .catch(err => console.log(err));
    }, []);

    const Update = (e) => {
        e.preventDefault();
        const formattedDate = `${dateDebut.getFullYear()}-${(dateDebut.getMonth() + 1).toString().padStart(2, '0')}-${dateDebut.getDate().toString().padStart(2, '0')}`;
        axios.put("http://localhost:3001/api/abonnements/update/" + id, { nom, cout, period, dateDebut: formattedDate })
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
                    <div className='col-lg-8'>
                        <div  className={`card shadow-lg border-0 rounded-lg mt-5 ${modeSombre ? 'text-white bg-dark' : 'bg-light'}`}>
                            <div className='card-header'>
                                <h3 className='text-center font-weight-light my-4'>Mon abonnement mise à jour !</h3>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={Update}>
                                    <div className='mb-3'>
                                        <label className='form-label'>Nom</label>
                                        <input
                                            type="text"
                                            className={`form-control ${modeSombre ? 'text-white bg-dark' : 'bg-light'}`}
                                            placeholder='Enter Name'
                                            value={nom}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Prix</label>
                                        <div className="row">
                                            <div className="col-auto">
                                                <input
                                                    type="number"
                                                    className={`form-control ${modeSombre ? 'text-white bg-dark' : 'bg-light'} small-input`}
                                                    placeholder="Entrer le prix"
                                                    value={cout}
                                                    onChange={handleCostChange}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <select
                                                    className={`form-select ${modeSombre ? 'text-white bg-dark' : 'bg-light'}`}
                                                    value={period}
                                                    onChange={(e) => setPeriod(e.target.value)}
                                                >
                                                    <option value="Mensuel">Mensuel</option>
                                                    <option value="Annuel">Annuel</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-label'>Date de début de facturation</label>
                                        <DatePicker
                                            selected={dateDebut}
                                            onChange={date => setDateDebut(date)}
                                            className={`form-control ${modeSombre ? 'text-white bg-dark' : 'bg-light'}`}
                                            placeholderText="MM/JJ/YYYY"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                    <div className='d-grid'>
                                        <button className='btn btn-primary btn-block'>Je mets à jour</button>
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

export default MettreAjourAbonnement;
