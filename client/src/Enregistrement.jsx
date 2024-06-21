import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Registration = () => {

    const [nom, setName] = useState()
    const [email, setEmail] = useState()
    const [motDePasse, setPassword] = useState()
    const navigate = useNavigate()

    const handleSUbmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register', {nom, email, motDePasse})
        .then(res => (
            navigate('/login')
        ))
        .catch(err => console.log(err))
    }
    

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSUbmit}>
                    <div className="mb-3">
                        <label htmlFor="nom">
                            <strong>Name</strong>
                        </label>
                        <input type="text" paceholder="Enter Name"
                        autoComplete="off" name="nom" className="form-control rounded-0"
                        onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input type="email" paceholder="Enter Email"
                        autoComplete="off" name="email" className="form-control rounded-0"
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input type="password" paceholder="Enter Password"
                        autoComplete="off" name="motDePasse" className="form-control rounded-0"
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">Register</button>
                </form>
                <p>Already Have an Account</p>
                <button className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Login</button>
            </div>
        </div>
    )
}

export default Registration