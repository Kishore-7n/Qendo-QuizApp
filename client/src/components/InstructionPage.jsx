


import React from 'react';
const InstructionPage = ({ onHide }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                    <h1 className="text-2xl font-bold mb-4">Quiz Instructions</h1>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Read each question carefully.</li>
                        <li>Select the best answer from the provided options.</li>
                        <li>You have a limited time to complete the quiz.</li>
                        <li>Once you submit your answer, you cannot change it.</li>
                        <li>Try to answer all questions to the best of your ability.</li>
                    </ul>
                    <button className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={onHide}>
                        Back To QuizList
                    </button>
                </div>
            </div>
        </>
    );
};

export default InstructionPage;
