import React, { useEffect, useState } from 'react';

const QuestionMenu = ({ questions, setCurrentQuestionIndex }) => {
    const api = 'http://localhost:3001';
    // const api = 'https://cyberminds.onrender.com';
    const [userAnsweredQuestions, setUserAnsweredQuestions] = useState([]);

    async function fetchUserAnswers() {
        try {
            const response = await fetch(`${api}/ans/user_answers/view`);
            if (!response.ok) {
                throw new Error('Failed to fetch user answers');
            }
            const data = await response.json();
            setUserAnsweredQuestions(data);
        } catch (error) {
            console.error('Error fetching user answers:', error);
        }
    }

    useEffect(() => {
        fetchUserAnswers();
    }, []);

    return (
        <div id="question-menu" className="bg-white shadow-2xl border border-gray-300 p-2 rounded-2xl w-80">
            <div className="divide-y divide-white">
                {questions.map((question, index) => {
                    const isAnswered = userAnsweredQuestions.some(answer => answer.question_id === question.id && answer.answer_id != null);

                    return (
                        <div
                            key={index}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className="flex items-center gap-2 py-2 px-5 hover:bg-gray-200 cursor-pointer"
                        >
                            <div className="text-black border border-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
                                {index + 1}
                            </div>
                            <div className="flex-1 ml-4">
                                <div className="font-bold">{question.title}</div>
                                <div className="text-sm text-green-600 font-semibold">Mcq</div>
                                <span className='text-gray-300 text-xs'>1 Point</span>
                            </div>
                            <div>
                                <div className={`w-7 h-7 rounded-full border-2 border-black ${isAnswered ? 'bg-green border-green' : 'bg-white'}`}>
                                    {isAnswered && <div className="w-2.5 h-2.5 bg-green-500 rounded-full m-auto"></div>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionMenu;
