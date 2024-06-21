import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const location = useLocation();
  const { quizId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const quizName = queryParams.get('quizName') || '';

  const totalQuestions = parseInt(queryParams.get('totalQuestions')) || 0;
  const totalCorrect = parseInt(queryParams.get('correct')) || 0;
  const totalAttended = parseInt(queryParams.get('attended')) || 0;

  const correctAnswers = totalCorrect;
  const wrongAnswers = totalAttended - correctAnswers;

  const centerTextPlugin = {
    id: 'centerText',
    afterDatasetsDraw(chart, args, plugins) {
      const { ctx } = chart;

      const centerX = chart.getDatasetMeta(0).data[0].x;
      const centerY = chart.getDatasetMeta(0).data[0].y;

      ctx.save();
      ctx.font = 'bold 2rem Poppins';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (chart.data.datasets.length > 0) {
        const datasetLabel = chart.data.datasets[0].label;
        if (datasetLabel === 'Attended') {
          ctx.fillText(totalAttended.toString(), centerX, centerY);
        } else if (datasetLabel === 'Correct') {
          ctx.fillText(correctAnswers.toString(), centerX, centerY);
        }
      }

      ctx.restore();
    },
  };

  const attendedData = {
    labels: ['Not Attended', 'Attended'],
    datasets: [
      {
        label: 'Attended',
        data: [totalQuestions - totalAttended, totalAttended],
        backgroundColor: ['#CCCCCC', 'orange'],
        hoverBackgroundColor: ['#CCCCCC', 'orange'],
        borderWidth: 0,
      },
    ],
  };

  const attendedOptions = {
    cutout: '85%',
    plugins: {
      centerText: centerTextPlugin,
    },
  };

  const correctData = {
    labels: ['Correct', 'Wrong'],
    datasets: [
      {
        label: 'Correct',
        data: [correctAnswers, totalAttended - correctAnswers],
        backgroundColor: ['green', '#CCCCCC'],
        hoverBackgroundColor: ['green', '#CCCCCC'],
        borderWidth: 0,
      },
    ],
  };

  const correctOptions = {
    cutout: '85%',
    plugins: {
      centerText: centerTextPlugin,
    },
  };

  return (
    <div className='bg-secondary min-h-screen p-2 flex flex-col items-center'>
      <div className='bg-white rounded-2xl w-full p-6 mb-2'></div>
      <div className='rounded-lg w-full p-1 flex flex-col items-center'>
        <h4 className='text-3xl sm:text-5xl font-bold mb-5 text-darkGreen'>Thank you for taking the test</h4>
        <h4 className='text-3xl sm:text-3xl font-bold text-darkGreen mb-5'>Your Report</h4>
        <div className='report-container w-full flex flex-col sm:flex-row justify-center items-center gap-4'>
          <div className='text-center mb-6 sm:mb-0 bg-white rounded-2xl p-5 w-72 h-96'>
            <h2 className='text-lg sm:text-2xl font-semibold mb-2'>Questions Attended</h2>
            <Doughnut data={attendedData} options={attendedOptions} plugins={[centerTextPlugin]} className='my-2' />
            <div className='flex justify-around my-1'><div className='mt-1 w-5 h-5 bg-orange rounded-md'></div><span>Total Attended</span> <span>{totalAttended}</span></div>
            <hr />
            <div className='flex justify-around my-1'><div className='ml-1 w-5 h-5 bg-secondary rounded-md'></div><span>Total Questions</span> <span>{totalQuestions}</span></div>
          </div>
          <div className='text-center bg-white rounded-2xl p-5 w-72 h-96'>
            <h2 className='text-lg sm:text-2xl font-semibold mb-2'>Correct Answers</h2>
            <Doughnut data={correctData} options={correctOptions} plugins={[centerTextPlugin]} className='my-2' />
            <div className='flex justify-around my-1'><div className='mt-1 w-5 h-5 bg-darkGreen rounded-md'></div><span>Total Correct</span> <span>{correctAnswers}</span></div>
            <hr />
            <div className='flex justify-around my-1'><div className='ml-1 w-5 h-5 bg-secondary rounded-md'></div><span>Total Attended</span> <span>{totalAttended}</span></div>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row mt-8 space-y-4 sm:space-y-0 sm:space-x-4'>
          <Link to={`/quiz/${quizId}/${quizName}`} className='bg-darkGreen text-white font-bold py-2 px-4 rounded'>
            Retry Quiz
          </Link>
          <Link to='/' className='bg-darkGreen text-white font-bold py-2 px-4 rounded'>
            Back to Home
          </Link>
          <Link to='/leaderboard' className='bg-darkGreen text-white font-bold py-2 px-4 rounded'>
            View Leaderboard
          </Link>
        </div>
      </div>
      <div className='bg-white rounded-2xl w-full p-6 mt-8'></div>
    </div>
  );
};

export default Results;
