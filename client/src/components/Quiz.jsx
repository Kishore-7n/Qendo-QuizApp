import React, { useState } from 'react';

const Quiz = ({ quiz }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(new Array(quiz.questions.length).fill('')); 

    const handleSaveAndNext = () => {

        const updatedUserAnswers = [...userAnswers];
        updatedUserAnswers[currentQuestionIndex] = 'User selected answer'; 
        setUserAnswers(updatedUserAnswers);

      
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {

            console.log('End of quiz reached');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mt-4 w-full">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1}</h2>
                <p>Total Questions: {quiz.questions.length}</p>
            </div>
            <div className="mb-4">

                <p className="text-lg">{quiz.questions[currentQuestionIndex].text}</p>
            </div>
            <div className="space-y-4">
    
                {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 rounded-lg border border-gray-300 p-3 hover:bg-gray-100 transition duration-200">
                        <input type="radio" id={`option${index}`} name={`question${currentQuestionIndex}`} className="form-radio h-5 w-5 text-blue-600" />
                        <label htmlFor={`option${index}`} className="text-lg">{option}</label>
                    </div>
                ))}
            </div>
            <div className='bg-white rounded-lg shadow-lg p-4 w-full mt-4 flex justify-between'>
                <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded' onClick={handleSaveAndNext}>Save & Next</button>
                {currentQuestionIndex > 0 && <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded'>Previous</button>}
            </div>
        </div>
    );
};

export default Quiz;
