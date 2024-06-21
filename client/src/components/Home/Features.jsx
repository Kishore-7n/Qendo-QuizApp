import React from 'react';
import leaderboard from '/images/leaderboard.jpg';
import piechart from '/images/piechart.jpg';
import { Link } from 'react-router-dom';

const Features = () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="container mx-auto p-4 mb-10">
            <div className="flex flex-col lg:flex-row items-center justify-between">

                <div className="lg:w-1/2">
                    <h2 className="text-3xl font-bold mb-10 text-center text-primary">Explore Our Features</h2>
                    <div className="mb-6 text-lg ml-12">
                        <div className="flex items-center mb-2">
                            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-4"></span>
                            <p className="mb-0">Leaderboard to track your scores</p>
                        </div>
                        <div className="flex items-center mb-2">
                            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-4"></span>
                            <p className="mb-0">Profile views to manage your progress</p>
                        </div>
                        <div className="flex items-center mb-2">
                            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-4"></span>
                            <p className="mb-0">Visualization through Pie Charts</p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        {userInfo ? (
                            <Link to="/profile" className="btn btn-primary">Learn More</Link>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Learn More</Link>
                        )}
                    </div>
                </div>


                <div className="lg:w-1/2 lg:mt-0">
                    <div className="grid grid-cols-2 gap-4">
                        <img src={leaderboard} alt="Leaderboard" className="rounded-lg" />
                        <img src={piechart} alt="Pie Chart" className="rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;