import React from 'react';

const QuestionPallette = ({ questions, userAnswers, currentQuestionIndex, setCurrentQuestionIndex }) => {
  return (
    <div className="flex flex-wrap gap-2 sm:flex-row flex-col">
      {questions.map((_, index) => (
        <div
          key={index}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
            ${userAnswers[index] ? 'bg-green-500' : 'bg-white'}
            ${index === currentQuestionIndex ? 'border-2 border-blue-500' : ''}`}
          onClick={() => setCurrentQuestionIndex(index)}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default QuestionPallette;

