import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const api = 'http://localhost:3001';
  //const api = 'https://cyberminds.onrender.com';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = userInfo.id;
        const response = await fetch(`${api}/auth/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const quizzesAttended = userData ? userData.quizzes_attended : 0;
  const score = userData ? userData.score : 0;

  const centerTextPlugin = {
    id: 'centerText',
    afterDatasetsDraw(chart, args, plugins) {
      const { ctx } = chart;
      const centerX = chart.getDatasetMeta(0).data[0].x;
      const centerY = chart.getDatasetMeta(0).data[0].y;

      ctx.save();
      ctx.font = 'bold 40px Poppins';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (chart.data.datasets.length > 0) {
        const datasetLabel = chart.data.datasets[0].label;
        if (datasetLabel === 'Attended') {
          ctx.fillText('Attended', centerX, centerY);
        } else if (datasetLabel === 'Correct') {
          ctx.fillText('Score', centerX, centerY);
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
        data: [10 - quizzesAttended, quizzesAttended],
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
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Correct',
        data: [score, (10 * quizzesAttended) - score],
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
    <>
      <Navbar />
      <div className='bg-gray-100 min-h-screen flex flex-col items-center justify-center'>
        <h5 className='font-bold text-4xl mb-8'>Your Profile</h5>
        {userData && (
          <div className='bg-yellow-400 rounded-lg p-8 mb-8 w-full max-w-3xl'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className='flex items-center'>
                <h2 className='font-bold text-xl md:text-2xl mr-4'>USER NAME:</h2>
                <h4 className='font-semibold text-lg md:text-xl'>{userData.username}</h4>
              </div>
              <div className='flex items-center'>
                <h2 className='font-bold text-xl md:text-2xl mr-4'>EMAIL:</h2>
                <h4 className='font-semibold text-lg md:text-xl'>{userData.email}</h4>
              </div>
              <div className='flex items-center'>
                <h2 className='font-bold text-xl md:text-2xl mr-4'>QUIZZES ATTENDED:</h2>
                <h4 className='font-semibold text-lg md:text-xl'>{userData.quizzes_attended}</h4>
              </div>
              <div className='flex items-center'>
                <h2 className='font-bold text-xl md:text-2xl mr-4'>SCORE:</h2>
                <h4 className='font-semibold text-lg md:text-xl'>{userData.score}</h4>
              </div>
            </div>
          </div>
        )}
        <div className='flex flex-col md:flex-row justify-center w-full max-w-2xl space-y-4 md:space-y-0 md:space-x-4'>
          <div className='bg-green rounded-lg p-8 md:w-1/2'>
            <div className='text-center mb-8'>
              <h2 className='font-semibold text-lg md:text-xl mb-4'>Questions Attended</h2>
              <Doughnut data={attendedData} options={attendedOptions} plugins={[centerTextPlugin]} />
              <div className='mt-4'>Attended: {quizzesAttended}</div>
              <div>Total Quizzes: 10</div>
            </div>
          </div>
          <div className='bg-blue-400 rounded-lg p-8 md:w-1/2'>
            <div className='text-center mb-8'>
              <h2 className='font-semibold text-lg md:text-xl mb-4'>Correct Answers</h2>
              <Doughnut data={correctData} options={correctOptions} plugins={[centerTextPlugin]} />
              <div className='mt-4'>Total Correct: {score}</div>
              <div>Total Attended: {quizzesAttended * 10}</div>
            </div>
          </div>
        </div>
        <button className='btn bg-primary text-black mt-5'><Link to='/leaderboard'>View Leaderboard</Link></button>
      </div>
      <Footer />
    </>
  );
};

export default Profile;










