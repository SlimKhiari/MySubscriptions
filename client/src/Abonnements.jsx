import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

function Abonnements () {
    const [abonnements, setAbonnements] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001")
            .then(result => setAbonnements(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/delete/' + id)
            .then(res => {
                console.log(res);
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
                            <h3 className='text-center font-weight-light my-4'>Mes abonnements</h3>
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
                                                    <Link to={`/update/${abonnement._id}`} className='btn btn-success btn-sm me-2'>Update</Link>
                                                    <button className='btn btn-danger btn-sm' onClick={() => handleDelete(abonnement._id)}>Delete</button>
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
