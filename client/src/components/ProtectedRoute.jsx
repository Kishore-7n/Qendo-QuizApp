import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    if (user && user.username === 'admin') {
        return <Component />;
    } else {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded shadow-md text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">401 : Unauthorized</h2>
                    <p className="text-gray-700 mb-4">You do not have permission to view this page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Go Back to Home
                    </button>
                </div>
            </div>
        );
    }
};

export default ProtectedRoute;