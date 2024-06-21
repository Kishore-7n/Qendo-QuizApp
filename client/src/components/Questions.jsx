import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UpperSection from './Questions/UpperSection';
import QuestionSection from './Questions/QuestionSection';
import OptionSection from './Questions/OptionSection';
import slider from '/images/slider.png';
import '../App.css';

const Questions = () => {
  // const api = 'http://localhost:3001';
  const api = 'https://qendo.onrender.com';
  const { quizId, quizName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [finalUserAnswers, setFinalUserAnswers] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  useEffect(() => {
    if (questions.length > 0) {
      fetchAnswersForQuestion(questions[currentQuestionIndex]?.id);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }

    const fetchQuizInfo = async () => {
      try {
        const response = await fetch(`/api/quiz/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz information');
        }
        const data = await response.json();
        setQuizInfo(data);
      } catch (error) {
        console.error('Error fetching quiz information:', error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/quiz/quizzes/${quizId}/questions`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz questions');
        }
        const data = await response.json();
        setQuestions(data);
        setUserAnswers(new Array(data.length).fill(null));
        if (data.length > 0) {
          fetchAnswers(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
      }
    };

    const fetchAnswers = async (questionId) => {
      try {
        const response = await fetch(`/api/ans/${questionId}/answers`);
        if (!response.ok) {
          throw new Error('Failed to fetch answers');
        }
        const data = await response.json();
        setCurrentAnswers(data);
      } catch (error) {
        console.error('Error fetching answers:', error);
      }
    };

    if (quizId) {
      fetchQuizInfo();
      fetchQuestions();
    }
  }, [quizId]);

  const fetchAnswersForQuestion = async (questionId) => {
    try {
      const response = await fetch(`/api/ans/${questionId}/answers`);
      if (!response.ok) {
        throw new Error('Failed to fetch answers');
      }
      const data = await response.json();
      setCurrentAnswers(data);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const saveUserAnswer = async (quizId, questionId, answerId) => {
    try {
      console.log('Saving user answer:', { userId, quizId, questionId, answerId });

      const existingAnswerResponse = await fetch(`/api/ans/user_answers?questionId=${questionId}`);
      if (!existingAnswerResponse.ok) {
        throw new Error('Failed to fetch existing user answer');
      }
      const existingAnswerData = await existingAnswerResponse.json();
      console.log('Existing Answer:', existingAnswerData);

      if (existingAnswerData.length > 0) {
        const deleteResponse = await fetch(`/api/ans/user_answers/${existingAnswerData[0].id}`, {
          method: 'DELETE',
        });
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete existing user answer');
        }
        console.log('Deleted existing answer:', existingAnswerData[0]);
      }

      const newAnswerResponse = await fetch(`/api/ans/user_answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          questionId,
          answerId,
          quizId,
        }),
      });

      if (!newAnswerResponse.ok) {
        throw new Error('Failed to save user answer');
      }
      const newUserAnswer = await newAnswerResponse.json();
      console.log('Saved new answer:', newUserAnswer);

      const updatedUserAnswersResponse = await fetch(`/api/ans/user_answers`);
      if (!updatedUserAnswersResponse.ok) {
        throw new Error('Failed to fetch updated user answers');
      }
      const updatedUserAnswersData = await updatedUserAnswersResponse.json();
      setUserAnswers(updatedUserAnswersData);

    } catch (error) {
      console.error('Error saving user answer:', error);
    }
  };

  const handleSaveAndNext = async () => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(updatedUserAnswers);

    await saveUserAnswer(quizId, questions[currentQuestionIndex].id, selectedAnswer);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1]);
      fetchAnswersForQuestion(questions[currentQuestionIndex + 1].id);
    } else {
      console.log('End of quiz reached');
    }
  };

  const handleSubmit = async () => {
    await saveUserAnswer(quizId, questions[currentQuestionIndex].id, selectedAnswer);

    const response = await fetch(`/api/ans/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, quizId }),
    });

    const userResponse = await fetch(`/api/ans/user_answers/view`);
    const data = await userResponse.json();
    console.log("Data : ", data);
    setFinalUserAnswers(data);

    const result = await response.json();
    console.log('Evaluation result:', result);

    let attendedQuestions = data.filter(answer => answer.answer_id !== null).length;
    console.log("Before Last: ", attendedQuestions)

    console.log('Attended:', attendedQuestions);

    const deleteResponse = await fetch(`/api/ans/delete_user_answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, quizId }),
    });

    if (!deleteResponse.ok) {
      console.error('Failed to delete user answers');

    }

    navigate(`/results/${quizInfo.id}?points=${quizInfo.total_points}&totalQuestions=${quizInfo.total_questions}&correct=${result.score}&attended=${attendedQuestions}&quizName=${quizInfo.title}`);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
      fetchAnswersForQuestion(questions[currentQuestionIndex - 1].id);
    }
  };

  const handleClearAnswer = () => {
    setSelectedAnswer(null);
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = null;
    setUserAnswers(updatedUserAnswers);
  };

  const handleTimeout = () => {
    handleSubmit();
  };

  const handleStopTimer = () => {
    setTimeLeft(0);
    handleSubmit();
  };

  const handleEndRound = async () => {
    await saveUserAnswer(quizId, questions[currentQuestionIndex].id, selectedAnswer);

    const response = await fetch(`/api/ans/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, quizId }),
    });

    const result = await response.json();
    console.log('Evaluation result:', result);

    let attendedQuestions = userAnswers.filter(answer => answer !== null).length;
    if (selectedAnswer != null) {
      attendedQuestions += 1;
    }

    console.log('Attended:', attendedQuestions);

    const deleteResponse = await fetch(`/api/ans/delete_user_answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, quizId }),
    });

    if (!deleteResponse.ok) {
      console.error('Failed to delete user answers');
    }

    navigate(`/results/${quizInfo.id}?points=${quizInfo.total_points}&totalQuestions=${quizInfo.total_questions}&correct=${result.score}&attended=${attendedQuestions}&quizName=${quizInfo.title}`);
  };

  const [leftWidth, setLeftWidth] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMouseDown = (event) => {
    event.preventDefault();
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((event.clientX - containerRect.left) / containerRect.width) * 100;
    if (newLeftWidth >= 0 && newLeftWidth <= 100) {
      setLeftWidth(newLeftWidth);
    }
  };

  useEffect(() => {
    const handleDocumentMouseMove = (event) => handleMouseMove(event);
    const handleDocumentMouseUp = () => handleMouseUp();

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center bg-secondary p-4">
      <div className="bg-white rounded-3xl p-4 mt-2 w-full mb-4 h-1/8">
        <UpperSection
          onStopTimer={handleStopTimer}
          initialTime={timeLeft}
          onTimeout={handleTimeout}
          quizName={quizName}
          quizId={quizId}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          userAnswers={userAnswers}
          handleEndRound={handleEndRound}
        />
      </div>

      <div
        ref={containerRef}
        className="flex rounded-lg p-2 h-3/4 w-full relative gap-4"
      >
        <div className="bg-white p-5 rounded-2xl" style={{ width: `${leftWidth}%` }}>
          <QuestionSection question={questions[currentQuestionIndex]?.text || ''} questionNumber={currentQuestionIndex + 1} />
        </div>
        <div
          className="slider-handle flex justify-center items-center h-full cursor-pointer absolute top-0 w-10"
          style={{ left: `${leftWidth}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
        >
          <img src={slider} alt="slider" onMouseDown={handleMouseDown}/>
        </div>
        <div className="bg-white p-5 rounded-2xl" style={{ width: `${100 - leftWidth}%` }}>
          <OptionSection
            options={currentAnswers}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={setSelectedAnswer}
            onClearAnswer={handleClearAnswer}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 mt-4 w-full mb-4 h-1/8 flex justify-end">
        <div className='w-1/2 flex justify-between pr-5'>
          {currentQuestionIndex > 0 && (
            <button
              className="btn bg-white text-black border border-gray-500 hover:bg-secondary font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
              onClick={handlePrevious}
            >
              <span className="text-xl mr-2 pb-1 font-bold">←</span>Previous
            </button>
          )}
          <div className="flex justify-center">
            <button
              className="btn bg-white text-black border border-gray-500 hover:bg-secondary font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
              onClick={currentQuestionIndex < questions.length - 1 ? handleSaveAndNext : handleSubmit}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Save & Next <span className="text-xl ml-2 pb-1 font-bold">→</span>
                </>
              ) : (
                <>Submit</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
