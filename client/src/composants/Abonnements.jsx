import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AbonnementsListe from './AbonnementsListe';
import Notifications from './Notifications';

function Abonnements() {
    const [abonnements, setAbonnements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCost, setFilterCost] = useState('All');
    const [coutMoyen, setCoutMoyen] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const userEmail = 'test@test.test'; // Remplacez par l'email réel de l'utilisateur connecté

    useEffect(() => {
        axios.get(`http://localhost:3001/api/notifications/${userEmail}`)
            .then(res => {
                const unreadCount = res.data.filter(notification => !notification.read).length;
                setNotificationCount(unreadCount);
                setNotifications(res.data);
            })
            .catch(err => console.error(err));
    }, [userEmail]);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };    
    
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

    const normaliserCout = (abonnement) => {
        if (abonnement.period === 'Annuel') {
            return abonnement.cout / 12;
        }
        return abonnement.cout;
    };

    useEffect(() => {
        axios.get("http://localhost:3001/api/abonnements/dashboard")
            .then(result => {
                if (result.data.valid) {
                    const abonnements = result.data.abonnements;
                    const coutsNormaliser = abonnements.map(normaliserCout);
                    const coutMoyenCalcule = coutsNormaliser.reduce((acc, cost) => acc + cost, 0) / coutsNormaliser.length;
                    setAbonnements(abonnements);
                    setCoutMoyen(coutMoyenCalcule); 
                } else {
                    navigate("/");
                }
            })
            .catch(err => console.log(err));
    }, [navigate]);     

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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCostChange = (event) => {
        setFilterCost(event.target.value);
    };

    const filteredAbonnements = abonnements.filter((abonnement) => {
        return (
            abonnement.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterCost === 'All' || (filterCost === 'Low' && normaliserCout(abonnement) < coutMoyen) || (filterCost === 'High' && normaliserCout(abonnement) >= coutMoyen))
        );
    });    

    return (
        <div>            
            {/* Navbar */}
             <nav className={`navbar navbar-expand-lg ${modeSombre ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
                <div className="container-fluid">
                    <Link className="navbar-brand me-auto" to="/dashboard" style={{ color: modeSombre ? 'white' : 'black' }}>MySubscriptions</Link>

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Notifications 
                                notifications={notifications} 
                                showNotifications={showNotifications} 
                                toggleNotifications={toggleNotifications} 
                            />
                        </li>
                    </ul>

                    <div className="form-check form-switch me-3">
                        <input className="form-check-input d-none" type="checkbox" id="darkModeSwitch" checked={modeSombre} onChange={toggleModeSombre} />
                        <label className="form-check-label m-0 p-0" htmlFor="darkModeSwitch" style={{ cursor: 'pointer' }}>
                            <button onClick={toggleModeSombre} style={{ background: 'none', border: 'none', padding: 0 }}>
                                {modeSombre ? (
                                    <img src="../light_mode_logo.png" alt="Activer le mode clair" style={{ width: '46px', height: '45px' }} />
                                ) : (
                                    <img src="../dark_mode_logo.png" alt="Activer le mode sombre" style={{ width: '45px', height: '45px' }} />
                                )}
                            </button>
                        </label>
                    </div>

                    <button className="btn" onClick={handleLogout}>
                        <img
                            src="../logout_logo.png"
                            alt="Déconnexion"
                            style={{ width: '50px', height: '50px' }}
                        />
                    </button>
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
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${modeSombre ? 'bg-secondary text-white' : ''}`}
                                        placeholder="Tapez le nom de votre abonnement à chercher ici ..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                                <div className="mb-3">
                                    <select className={`form-select ${modeSombre ? 'bg-secondary text-white' : ''}`} value={filterCost} onChange={handleCostChange}>
                                        <option value="All">Tous les coûts</option>
                                        <option value="Low">Coût bas</option>
                                        <option value="High">Coût élevé</option>
                                    </select>
                                </div>
                                <AbonnementsListe abonnements={filteredAbonnements} handleDelete={handleDelete} modeSombre={modeSombre} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Abonnements;

