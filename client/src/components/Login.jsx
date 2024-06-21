import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/userSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const api = 'https://qendo.onrender.com';
      //const api = 'http://localhost:3001'
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logData, setLogData] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLogData({
            ...logData,
            [name]: value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logData)
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                console.log("Data from backend", data.user);
                const { exp } = jwtDecode(data.token);
                const expiresIn = exp * 1000 - Date.now();
                setTimeout(() => {
                    handleLogout();
                }, expiresIn);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch(login({ user: data.user, token: data.token }));
                console.log(data.user);
                navigate('/');
            } else {
                console.log("Error occurred: ", data.message);
            }
        } catch (error) {
            console.error("Error is: ", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input type="text" placeholder="Username" name='username' value={logData.username} onChange={handleInputChange} required className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" placeholder="Password" name='password' value={logData.password} onChange={handleInputChange} required className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <button type="submit" className="btn btn-primary w-full">Login</button>
                    </div>
                    <div className='text-center'>
                        New User? <Link to="/register" className="text-blue-500 underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
