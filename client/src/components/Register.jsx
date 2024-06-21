import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {

    const api = 'https://qendo.onrender.com';
    // const api = 'http://localhost:3001'
    const navigate = useNavigate();

    const [regData, setRegData] = useState({
        username: '',
        password: '',
        email: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegData({
            ...regData,
            [name]: value
        });
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(regData)
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                navigate('/login')
            } else {
                console.log("Some Error Occured")
                console.log(data.message);
            }
        } catch (error) {
            console.error("Error is: ", error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input type="text" placeholder="Username" name='username' value={regData.username} onChange={handleInputChange} required className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" placeholder="Password" name='password' value={regData.password} onChange={handleInputChange} required className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" placeholder="Email" name='email' value={regData.email} onChange={handleInputChange} required className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <button type="submit" className="btn btn-primary w-full">Register</button>
                    </div>
                    <div className='text-center'>
                        Already existing user? <Link to="/login" className="text-blue-500 underline">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register
