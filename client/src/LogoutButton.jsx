import axios from 'axios';
import React from 'react';
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();

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
        <button onClick={handleLogout} className="btn btn-danger">
            Se déconnecter
        </button>
    );
};

export default LogoutButton;