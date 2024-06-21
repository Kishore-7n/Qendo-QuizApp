import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'
import Footer from './Footer'

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
     //const api = 'http://localhost:3001'
     const api = 'https://qendo.onrender.com';

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch(`/api/quiz/leaderboard`);
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data');
                }
                const data = await response.json();
                // Sort leaderboard by Marks in descending order
                const sortedData = data.sort((a, b) => b.Marks - a.Marks);
                setLeaderboardData(sortedData);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
        <>
        <Navbar/>
        <div className="container mx-auto py-8 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8 text-primary">Leaderboard</h1>
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-200 w-3/4 text-center text-xl mx-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Rank</th>
                            <th className="border border-gray-300 px-4 py-2">Username</th>
                            <th className="border border-gray-300 px-4 py-2">Quiz Attended</th>
                            <th className="border border-gray-300 px-4 py-2">Total Score</th>
                            <th className="border border-gray-300 px-4 py-2">Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((user, index) => (
                            <tr 
                                key={user.id} 
                                className={
                                    index === 0 
                                    ? 'bg-yellow-400' 
                                    : index === 1 
                                    ? 'bg-gray-400' 
                                    : index === 2 
                                    ? 'bg-orange-400' 
                                    : ''
                                }
                            >
                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.quizzes_attended}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.score}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.marks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-8 text-center">
                <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back to Home
                </Link>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default Leaderboard;
