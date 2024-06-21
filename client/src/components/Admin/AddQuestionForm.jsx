import React, { useState, useEffect } from 'react';

const AddQuestionForm = ({ quizId, onQuestionAdded }) => {
    const api = 'https://qendo.onrender.com';
    //const api = 'http://localhost:3001'
    const [text, setText] = useState('');
    const [answers, setAnswers] = useState([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
    ]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, [quizId]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`/api/quiz/quizzes/${quizId}/questions`);
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleEdit = async (question) => {
        setSelectedQuestion(question);
        setText(question.text);

        try {

            const response = await fetch(`${api}/quiz/questions/${question.id}`);
            const updatedQuestion = await response.json();


            const initialAnswers = [
                { text: '', is_correct: false },
                { text: '', is_correct: false },
                { text: '', is_correct: false },
                { text: '', is_correct: false },
            ];


            const mappedAnswers = updatedQuestion.answers && updatedQuestion.answers.length >= 4
                ? updatedQuestion.answers.slice(0, 4).map(answer => ({
                    text: answer.text,
                    is_correct: answer.is_correct,
                }))
                : initialAnswers;


            setAnswers(mappedAnswers);
        } catch (error) {
            console.error('Error fetching question details:', error);
        }
    };





    const handleAnswerChange = (index, field, value) => {
        const newAnswers = [...answers];
        newAnswers[index][field] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let newQuestion = null;

            if (selectedQuestion) {

                const response = await fetch(`${api}/quiz/questions/${selectedQuestion.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text }),
                });
                newQuestion = await response.json();
            } else {

                const questionResponse = await fetch(`${api}/quiz/${quizId}/questions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text }),
                });
                newQuestion = await questionResponse.json();
            }

      
            const answerPromises = answers.map(answer =>
                fetch(`${api}/quiz/questions/${newQuestion.id}/answers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(answer),
                })
            );

            await Promise.all(answerPromises);

          
            onQuestionAdded({ ...newQuestion, answers });

       
            setText('');
            setAnswers([
                { text: '', is_correct: false },
                { text: '', is_correct: false },
                { text: '', is_correct: false },
                { text: '', is_correct: false },
            ]);
            setSelectedQuestion(null); 
            fetchQuestions(); 
        } catch (error) {
            console.error('Error adding/editing question and answers:', error);
        }
    };



    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h2 className="text-xl mb-2">{selectedQuestion ? 'Edit Question and Answers' : 'Add New Question and Answers'}</h2>
            <div className="mb-2">
                <label className="block mb-1">Question:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="textarea textarea-bordered w-full"
                    required
                ></textarea>
            </div>
            <div className="mb-2">
                <label className="block mb-1">Answers:</label>
                {answers.map((answer, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                            className="input input-bordered w-full"
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                        <label className="ml-2 flex items-center">
                            <input
                                type="radio"
                                checked={answer.is_correct}
                                onChange={(e) => handleAnswerChange(index, 'is_correct', e.target.checked)}
                                className="radio"
                                name={`correct-answer-${index}`}
                            />
                            <span className="ml-1">Correct</span>
                        </label>
                    </div>
                ))}
            </div>
            <button type="submit" className="btn btn-primary">
                {selectedQuestion ? 'Update Question and Answers' : 'Add Question and Answers'}
            </button>
            {selectedQuestion && (
                <button type="button" className="btn btn-secondary ml-2" onClick={() => setSelectedQuestion(null)}>
                    Cancel Edit
                </button>
            )}
            <div className="mt-4">
                <h3 className="text-lg mb-2">Existing Questions</h3>
                {questions.map((question) => (
                    <div key={question.id} className="mb-2">
                        <button type="button" className="btn btn-sm btn-outline-primary mr-2" onClick={() => handleEdit(question)}>
                            Edit
                        </button>
                        {question.text}
                    </div>
                ))}
            </div>
        </form>
    );
};

export default AddQuestionForm;
