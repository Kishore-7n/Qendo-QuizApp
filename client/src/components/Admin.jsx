import React, { useState, useEffect } from 'react';
import AddQuizForm from './Admin/AddQuizForm';
import AddQuestionForm from './Admin/AddQuestionForm';

const Admin = () => {
    const api = 'https://qendo.onrender.com';
     //const api = 'http://localhost:3001'
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch(`/api/quiz/view`);
            const data = await response.json();
            setQuizzes(data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    const handleQuizAdded = (newQuiz) => {
        setQuizzes([...quizzes, newQuiz]);
    };

    const handleQuestionAdded = (newQuestion) => {
        const updatedQuizzes = quizzes.map((quiz) => {
            if (quiz.id === newQuestion.quizId) {
                return {
                    ...quiz,
                    questions: [...quiz.questions, newQuestion],
                };
            }
            return quiz;
        });
        setQuizzes(updatedQuizzes);
    };

    const handleQuizChange = (e) => {
        setSelectedQuizId(e.target.value);
    };

    return (
        <div className="container mx-auto p-4">
            <AddQuizForm onQuizAdded={handleQuizAdded} />

            {quizzes.length > 0 && (
                <div className="mb-4">
                    <label className="block mb-2">Select Quiz:</label>
                    <select onChange={handleQuizChange} className="select select-bordered w-full">
                        <option value="">Select a quiz</option>
                        {quizzes.map((quiz) => (
                            <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedQuizId && (
                <AddQuestionForm quizId={selectedQuizId} onQuestionAdded={handleQuestionAdded} />
            )}

            {selectedQuizId && quizzes.find((quiz) => quiz.id === parseInt(selectedQuizId))?.questions?.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg mb-2">Questions</h3>
                    <ul className="list-disc list-inside">
                        {quizzes
                            .find((quiz) => quiz.id === parseInt(selectedQuizId))
                            .questions.map((question) => (
                                <li key={question.id}>
                                    {question.text}
                                    <ul className="list-decimal list-inside ml-4">
                                        {question.answers.map((answer, index) => (
                                            <li key={index}>
                                                {answer.text} {answer.is_correct && "(Correct)"}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Admin;