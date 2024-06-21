import React from 'react'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import QuizList from './components/QuizList'
import Admin from './components/Admin'
import Questions from './components/Questions'
import Results from './components/Results'
import Profile from './components/Profile'
import Register from './components/Register'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Leaderboard from './components/LeaderBoard'
import InstructionPage from './components/InstructionPage'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/'>
        <Route path='' element={<Home />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        <Route path='/quizlist' element={<QuizList />} />
        <Route path='/admin' element={<ProtectedRoute element={Admin} />} />
        <Route path='/questions' element={<Questions />} />
        <Route path="/results/:quizId" element={<Results />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/quiz/:quizId/:quizName" Component={Questions} />
        <Route path='/leaderboard' element={<Leaderboard />} />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
