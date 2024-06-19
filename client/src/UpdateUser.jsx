import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import DatePicker from "react-datepicker";


function UpdateUser () {
    const {id} = useParams() 
    const [nomAbonnement, setName] = useState()
    const [cout, setCout] = useState()
    const [period, setPeriod] = useState()
    const [dateDebut, setDateDebut] = useState(null);  

    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:3001/getUser/'+id)
        .then(result => {console.log(result)
           setName(result.data.nomAbonnement)
           setCout(result.data.cout)
           setPeriod(result.data.period)
           setDateDebut(result.data.dateDebut)
        })
        .catch(err => console.log(err))
    }, [])
 
    const Update = (e) => {
        e.preventDefault();
        axios.put("http://localhost:3001/updateUser/"+id, {nomAbonnement, cout, period, dateDebut})
        .then(result => {
            console.log(result)
            navigate("/")
        })
        .catch(err => console.log(err))
    }

    const handleCostChange = (e) => {
        let value = parseInt(e.target.value); 
        if (isNaN(value) || value < 0) { 
              value = 0; 
        }
        setCout(value);
    };
    
    return (
        <div>
            <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
                <div className='w-50 bg-white rounded p-3'>
                    <form onSubmit={Update}>
                        <h2>Update User</h2>
                        <div className='mb-2'>
                            <label htmlFor="">Nom de l'abonnement</label>
                            <input type="text" placeholder='Enter Name' className='form-control'
                            value={nomAbonnement} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label>Coût de l'abonnement:</label>
                            <div className="input-group">
                            <input type="number" name="cost" className="form-control" placeholder="Enter Price"
                                value={cout} onChange={handleCostChange}
                            />
                            <div className="input-group-append">
                                <select name="interval" className="form-control"
                                value={period} onChange={(e) => setPeriod(e.target.value)}
                                >
                                <option value="Mensuel">Mensuel</option>
                                <option value="Annuel">Annuel</option>
                                </select>
                            </div>
                            </div>
                        </div>
                        <div className='mb-2'>
                            <label>Date de début de facturation:</label>
                            <DatePicker
                                selected={dateDebut}
                                onChange={(e) => setDateDebut(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <button className='btn btn-success'>Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateUser;