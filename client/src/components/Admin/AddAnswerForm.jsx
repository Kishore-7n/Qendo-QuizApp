import React, { useState, useEffect } from 'react';

const AddAnswerForm = ({ questionId }) => {
    //const api = 'https://qendo.onrender.com';
    //const api = 'http://localhost:3001'
    const [text, setText] = useState('');
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if (questionId) {
            fetchAnswers();
        }
    }, [questionId]);

    const fetchAnswers = async () => {
        try {
            const response = await fetch(`/api/quiz/questions/${questionId}/answers`);
            const data = await response.json();
            setAnswers(data);
        } catch (error) {
            console.error('Error fetching answers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${api}/quiz/questions/${questionId}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            setText('');
            fetchAnswers();
        } catch (error) {
            console.error('Error adding answer:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h2 className="text-xl mb-2">Add New Answer</h2>
            <div className="mb-2">
                <label className="block mb-1">Answer:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="textarea textarea-bordered w-full"
                    required
                ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Add Answer</button>

            {answers.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg mb-2">Answers</h3>
                    <ul className="list-disc list-inside">
                        {answers.map((answer) => (
                            <li key={answer.id}>{answer.text}</li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
};

export default AddAnswerForm;
