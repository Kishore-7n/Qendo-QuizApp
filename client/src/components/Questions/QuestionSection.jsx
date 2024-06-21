import React from 'react';

const QuestionSection = ({ question, questionNumber }) => {
    return (
        <div className="flex-1 pr-6">
            <div className='mb-10'>Question {questionNumber}</div>
            <p className="text-lg">{question}</p>
        </div>
    );
};

export default QuestionSection;


