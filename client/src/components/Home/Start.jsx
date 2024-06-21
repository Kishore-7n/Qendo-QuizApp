import React from 'react';
import bgImg1 from '/images/bgImg1.jpg';
import { Link } from 'react-router-dom';

const Start = () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="container mx-auto p-4 mb-10 bg-gradient-to-br from-violet-200 via-violet-400 to-violet-700">
            <div className="flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-violet-200 via-violet-400 to-violet-700 rounded-lg p-6">
                <div className="lg:w-1/2 mb-4 lg:mb-0 lg:mr-8">
                    <img src={bgImg1} alt="Quiz" className="rounded-lg w-full" />
                </div>

                <div className="lg:w-1/2">
                    <h2 className="text-3xl font-bold mb-4 text-center lg:text-left">Start Your Quiz Now</h2>
                    <p className="mb-6 text-lg text-center lg:text-left">
                        Check your knowledge and challenge yourself with our quizzes. Start now to learn and have fun!
                    </p>
                    <div className="flex justify-center lg:justify-start">
                        {userInfo ? (
                            <Link to="/quizlist" className="btn btn-primary">Start Quiz</Link>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Start Quiz</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Start;