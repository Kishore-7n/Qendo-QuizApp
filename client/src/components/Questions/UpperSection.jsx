import React, { useState } from 'react';
import { FaClock } from 'react-icons/fa';
import CountdownTimer from '../QuizList/CountDownTimer';
import { Link } from 'react-router-dom';
import QuestionMenu from './QuestionMenu';

const UpperSection = ({ onStopTimer, initialTime, onTimeout, quizName, quizId, questions, currentQuestionIndex, setCurrentQuestionIndex, userAnswers, handleEndRound }) => {
    const api = 'http://localhost:3001';

    const [menuOpen, setMenuOpen] = useState(false);

    const handleDeleteUserAnswers = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userId = storedUser.id;

            const response = await fetch(`${api}/ans/delete_user_answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, quizId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete user answers');
            }

            console.log('User answers deleted successfully');
        } catch (error) {
            console.error('Error deleting user answers:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    
    return (
        <div className="relative">
            <div className="flex justify-between items-center rounded-2xl p-4 bg-white">
                <div className='ml-10'>
                    <Link to="/quizlist" className="hover:bg-secondary text-black px-3 py-3 rounded-lg mr-4" onClick={handleDeleteUserAnswers}>
                        <span className="text-4xl font-bold">←</span>
                    </Link>
                    <button onClick={toggleMenu} className="hover:bg-secondary text-black px-3 py-2 rounded-lg focus:outline-none">
                        <span className="text-2xl">☰</span>
                    </button>
                </div>
                <h1 className="text-xl font-bold">{quizName}</h1>
                <div className="flex items-center">
                    <FaClock className="text-gray-700 mr-1" />
                    <CountdownTimer initialTime={initialTime} onTimeout={onTimeout} />
                    <button className="bg-secondary text-black px-4 py-2 rounded-lg font-semibold ml-4" onClick={handleEndRound}>
                        End Round
                    </button>
                </div>
            </div>

            {/* Conditionally render QuestionMenu based on menuOpen state */}
            {menuOpen && (
                <div className="absolute top-0 left-0 mt-16 mr-4 z-10">
                    <QuestionMenu
                        questions={questions}
                        setCurrentQuestionIndex={setCurrentQuestionIndex}
                        selectedOptions={userAnswers}
                    />
                </div>
            )}
        </div>
    );
};

export default UpperSection;
