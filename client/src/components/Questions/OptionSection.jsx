import React from 'react';

const OptionSection = ({ options, selectedAnswer, onSelectAnswer, onClearAnswer }) => {
    return (
        <div className="flex-1 pl-6">
            <div className='mb-10'>Select One of the Following Options</div>
            <div className="space-y-4">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`flex items-center w-1/2 space-x-2 rounded-3xl border border-gray-300 p-3 cursor-pointer hover:bg-gray-100 transition duration-200 ${selectedAnswer === option.id ? 'bg-gray-100' : ''}`}
                        onClick={() => onSelectAnswer(option.id)}
                    >
                        <input
                            type="radio"
                            id={`option${index}`}
                            name="option"
                            className="form-radio h-5 w-5 text-blue-600 mr-2"
                            checked={selectedAnswer === option.id}
                            onChange={() => onSelectAnswer(option.id)}
                        />
                        <label htmlFor={`option${index}`} className="text-lg">{option.text}</label>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                {selectedAnswer && (
                    <button
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                        onClick={() => onClearAnswer()}
                    >
                        Clear Response
                    </button>
                )}
            </div>
        </div>
    );
};

export default OptionSection;
