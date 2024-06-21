import React from 'react';
import coverImg1 from "/images/coverImg1.jpg";
import { Link } from 'react-router-dom';

const Hero = () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="container mx-auto p-4 min-h-64 flex items-center">
            <div className="w-1/2 pr-8 text-center">
                <h1 className="text-4xl font-bold mb-10 text-primary">Welcome to Øendo</h1>
                <p className="text-lg mb-10">
                    Discover and challenge yourself with the best quizzes.
                    Test your knowledge, learn new facts, and have fun while competing with friends.
                </p>
                <div className='text-xl my-4 font-bold text-primary'>Start your journey with us today!</div>
                {userInfo ? (
                    <Link to='/quizlist' className="btn btn-primary">Get Started</Link>
                ) : (
                    <Link to='/login' className="btn btn-primary">Get Started</Link>
                )}
            </div>
            <div className="w-1/2 min-h-64">
                <img src={coverImg1} alt="Quiz illustration" className="rounded-lg" />
            </div>
        </div>
    );
};

export default Hero;