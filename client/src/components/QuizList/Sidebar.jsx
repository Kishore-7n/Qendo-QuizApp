import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClipboardList,
    faUser,
    faTrophy,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import '../../App.css';

const Sidebar = () => {
    return (
        <div className="min-h-screen w-64 bg-white">
            <div className="flex items-center justify-center h-1 text-primary font-bold text-4xl mb-10 p-5 mt-10">
                Øendo
            </div>
            <nav className="flex flex-col mt-12">
                <a href="/quizlist" className="py-2 px-9 rounded text-lg relative hover-underline flex items-center">
                    <FontAwesomeIcon icon={faClipboardList} className="text-primary mr-2" />
                    Tests
                </a>
                <a href="/profile" className="py-2 px-8 rounded text-lg relative hover-underline flex items-center">
                    <FontAwesomeIcon icon={faUser} className="text-primary mr-2" />
                    Profile
                </a>
                <a href="/leaderboard" className="py-2 px-8 rounded text-lg relative hover-underline flex items-center">
                    <FontAwesomeIcon icon={faTrophy} className="text-primary mr-2" />
                    LeaderBoard
                </a>
                <a href="/" className="py-2 px-9 rounded text-lg relative hover-underline flex items-center">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-primary mr-2" />
                    Back
                </a>
            </nav>
        </div>
    );
};

export default Sidebar;
