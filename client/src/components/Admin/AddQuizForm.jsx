import React, { useState } from 'react';

const AddQuizForm = ({ onQuizAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [totalQuestions, setTotalQuestions] = useState('');
    const [totalPoints, setTotalPoints] = useState('');

    const handleSubmit = async (e) => {
        const api = 'https://qendo.onrender.com';
        //const api = 'http://localhost:3001'
        e.preventDefault();
        try {
            const response = await fetch(`/api/quiz/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, totalQuestions, totalPoints }),
            });
            const data = await response.json();
            setTitle('');
            setDescription('');
            setTotalQuestions('');
            setTotalPoints('');
            onQuizAdded(data);
        } catch (error) {
            console.error('Error adding quiz:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h2 className="text-xl mb-2">Add New Quiz</h2>
            <div className="mb-2">
                <label className="block mb-1">Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full"
                    required
                />
            </div>
            <div className="mb-2">
                <label className="block mb-1">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered w-full"
                    required
                ></textarea>
            </div>
            <div className="mb-2">
                <label className="block mb-1">Total Questions:</label>
                <input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    className="input input-bordered w-full"
                    required
                />
            </div>
            <div className="mb-2">
                <label className="block mb-1">Total Points:</label>
                <input
                    type="number"
                    value={totalPoints}
                    onChange={(e) => setTotalPoints(e.target.value)}
                    className="input input-bordered w-full"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Add Quiz</button>
        </form>
    );
};

export default AddQuizForm;