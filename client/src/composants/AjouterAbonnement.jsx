import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

function AjouterAbonnement () {
    const [nom, setName] = useState("");
    const [cout, setCout] = useState();
    const [period, setPeriod] = useState("Mensuel");
    const [dateDebut, setDateDebut] = useState(new Date());
    const [email, setEmail] = useState("test@test.com");

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
        axios.post("http://localhost:3001/api/abonnements/create", {nom, cout, period, dateDebut: formattedDate, email})
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

    return (
        <div className="container mt-5">
            <div className='row justify-content-center'>
                <div className='col-lg-6'>
                    <div className='card shadow-lg border-0 rounded-lg mt-5'>
                        <div className='card-header'>
                            <h3 className='text-center font-weight-light my-4'>Mon nouveau abonnement !</h3>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={Submit}>
                                <div className='form-floating mb-3'>
                                    <input 
                                        type='text' 
                                        className='form-control' 
                                        id='nom' 
                                        value={nom} 
                                        onChange={(e) => setName(e.target.value)} 
                                    />
                                    <label htmlFor='nomAbonnement'>Nom</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input 
                                        type='number' 
                                        className='form-control' 
                                        id='cout' 
                                        value={cout} 
                                        onChange={handleCostChange} 
                                    />
                                    <label htmlFor='cout'>Coût</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <select 
                                        className='form-select' 
                                        id='period' 
                                        value={period} 
                                        onChange={(e) => setPeriod(e.target.value)}
                                    >
                                        <option value='Mensuel'>Mensuel</option>
                                        <option value='Annuel'>Annuel</option>
                                    </select>
                                    <label htmlFor='period'>Période</label>
                                </div>
                                <div className='mb-2'>
                                    <label htmlFor='dateDebut'>Date de début de facturation</label>
                                    <DatePicker
                                        selected={dateDebut}
                                        onChange={date => setDateDebut(date)}
                                        className='form-control'
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
    );
}

export default AjouterAbonnement;
