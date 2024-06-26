import React from 'react';
import { Link } from 'react-router-dom';

function AbonnementsListe({ abonnements, handleDelete, modeSombre }) {
    return (
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
    );
}

export default AbonnementsListe;