import React,{ useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from 'axios'


function Users () {
    const [users, setUsers] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3001")
        .then(result => setUsers(result.data))
        .catch(err => console.log(err))
    }, [])

    const handleDelete = (id) => {
       axios.delete('http://localhost:3001/deleteUser/'+id)
       .then(res => {console.log(res)
          window.location.reload()})
       .catch(err => console.log(err))
    }

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className='w-50 bg-white rounded p-3'>
                  <h2>Mes abonnements :</h2>
                  <table className='table'>
                        <thead>
                            <tr>  
                                <th>Nom de l'abonnement</th>
                                <th>Coût</th>
                                <th>Période</th>
                                <th>Date de début</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                           {
                                users.map((users) => {
                                   return <tr>
                                        <td>{users.nomAbonnement}</td>
                                        <td>{users.cout}</td>
                                        <td>{users.period}</td>
                                        <td>{users.dateDebut}</td>
                                        <td>
                                            <Link to={`/update/${users._id}`} className='btn btn-success'>Update</Link>
                                            <button className='btn btn-danger' 
                                               onClick={(e) => handleDelete(users._id)}>Delete</button>
                                        </td>
                                    </tr>
                                })
                           }
                        </tbody>
                  </table>
                  <Link to="/create" className='btn btn-success'>Add +</Link>
            </div>
        </div>
    )
}

export default Users;