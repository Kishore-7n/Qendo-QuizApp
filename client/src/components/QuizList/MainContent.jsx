import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstructionPage from '../InstructionPage'; // Adjust the import path if necessary

const MainContent = () => {
    // const api = 'https://cyberminds.onrender.com';
    const api = 'http://localhost:3001';
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [ins, setIns] = useState(false);

    const handleClick = () => {
        setIns(true);
    };

    const handleClose = () => {
        setIns(false);
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`${api}/quiz/view`);
                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes');
                }
                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    const handleSolveChallenge = (quizId) => {
        setSelectedQuizId(quizId);
    };

    return (
        <div className="sm:flex-2 md:flex-1 p-4 ml-5    ">
            <div className='flex rounded-lg bg-white p-5 mb-5'>
                <h1 className="text-2xl font-bold mt-2 mr-5">Quizzes for you!</h1>
                <button className="btn bg-darkYellow text-black border-white" onClick={handleClick}>
                    View Instructions
                </button>
                {ins && <InstructionPage onHide={handleClose} />}
            </div>
            <div className="grid grid-cols-1 gap-4 w-3/4">
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className="card bg-base-100 shadow-md flex flex-row justify-between items-center pr-5 hover:bg-lightYellow hover:border border-darkYellow group">
                        <div className="card-body">
                            <h2 className="card-title"> <span className='font-bold'>{quiz.title}</span></h2>
                            <div className='flex justify-around'>
                                <p>Total Questions <span className='font-bold'>{quiz.total_questions}</span></p>
                                <p>Total Points <span className='font-bold'>{quiz.total_points}</span></p>
                            </div>
                        </div>
                        <div className="card-actions">
                            <Link to={`/quiz/${quiz.id}/${quiz.title}`}>
                                <button className="btn text-black border-white group-hover:bg-darkYellow" onClick={() => handleSolveChallenge(quiz.id)}>
                                    Solve Challenge
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default MainContent;



