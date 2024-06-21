import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';

const Navbar = () => {
    const [username, setUsername] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const userInfo = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUsername(user.username);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUsername(null);
        dispatch(logout());
        navigate('/')
    };

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul className="menu menu-sm dropdown-content mt-3 z-[1] bg-base-100 w-52 text-xl">
                        <li><Link to="/" className="hover:text-primary hover:underline-slow">Home</Link></li>
                        <li>{userInfo ? (<Link to="/quizlist" className="hover:text-primary hover:underline-slow">Quizzes</Link>) : (<Link to="/login" className="hover:text-primary hover:underline-slow">Quizzes</Link>)}</li>
                        <li>{userInfo ? (<Link to="/profile" className="hover:text-primary hover:underline-slow">Profile</Link>) : (<Link to="/login" className="hover:text-primary hover:underline-slow">Profile</Link>)}</li>
                        <li><Link to="/admin" className="hover:text-primary hover:underline-slow">Admin</Link></li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl hover:text-primary hover:underline-slow text-primary">Øendo</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-lg">
                    <li><Link to="/" className="hover:text-primary hover:underline-slow">Home</Link></li>
                    <li>{userInfo ? (<Link to="/quizlist" className="hover:text-primary hover:underline-slow">Quizzes</Link>) : (<Link to="/login" className="hover:text-primary hover:underline-slow">Quizzes</Link>)}</li>
                    <li>{userInfo ? (<Link to="/profile" className="hover:text-primary hover:underline-slow">Profile</Link>) : (<Link to="/login" className="hover:text-primary hover:underline-slow">Profile</Link>)}</li>
                    <li><Link to="/admin" className="hover:text-primary hover:underline-slow">Admin</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                {username ? (
                    <div className="flex items-center text-lg">
                        <span className="mr-2">Hi, {username}</span>
                        <button onClick={handleLogout} className="btn bg-primary text-black">Logout</button>
                    </div>
                ) : (
                    <Link to="/register">
                        <div className="btn hover:bg-opacity-90 text-lg">Register / Login</div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;