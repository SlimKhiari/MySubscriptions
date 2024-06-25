import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MettreAjourAbonnement() {
    const { id } = useParams();
    const [nom, setName] = useState("");
    const [cout, setCout] = useState(0);
    const [period, setPeriod] = useState("Mensuel");
    const [dateDebut, setDateDebut] = useState(new Date());

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

    return (
        <div className="container mt-5">
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <div className='card shadow-lg border-0 rounded-lg mt-5'>
                        <div className='card-header'>
                            <h3 className='text-center font-weight-light my-4'>Mon abonnement mise à jour !</h3>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={Update}>
                                <div className='mb-3'>
                                    <label className='form-label'>Nom</label>
                                    <input
                                        type="text"
                                        className='form-control'
                                        placeholder='Enter Name'
                                        value={nom}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className='form-label'>Prix</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Price"
                                            value={cout}
                                            onChange={handleCostChange}
                                        />
                                        <div className="input-group-append">
                                            <select
                                                className="form-select"
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
                                        className="form-control"
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
    );
}

export default MettreAjourAbonnement;
