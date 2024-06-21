import React from 'react'
import MainContent from './QuizList/MainContent'
import Sidebar from './QuizList/Sidebar'

const QuizList = () => {
    return (
        <div className="flex bg-secondary">
            <Sidebar />
            <MainContent />
        </div>
    )
}

export default QuizList
