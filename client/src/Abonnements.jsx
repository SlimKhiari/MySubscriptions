import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

function Abonnements () {
    const [abonnements, setAbonnements] = useState([]);
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:3001/dashboard")
            .then(result => {
                if(result.data.valid) {
                    setAbonnements(result.data.abonnements)
                } else {
                    navigate("/")
                }}
            )
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/delete/' + id)
            .then(res => {
                setAbonnements(abonnements.filter(user => user._id !== id));
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container mt-5">
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <div className='card shadow-lg border-0 rounded-lg mt-5'>
                        <div className='card-header'>
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
                                                    <img src="../public/update_logo.jpg" alt="Update" style={{ width: '20px', height: '20px' }} /></Link>
                                                    <button className='btn btn-sm' onClick={() => handleDelete(abonnement._id)}>
                                                    <img src="../public/delete_logo.png" alt="Update" style={{ width: '20px', height: '20px' }} />
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
    );
}

export default Abonnements;
