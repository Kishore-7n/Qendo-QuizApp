import React from 'react'
import Hero from './Home/Hero'
import Navbar from './Navbar'
import Footer from './Footer'
import Features from './Home/Features'
import Start from './Home/Start'

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Start />
            <Footer />
        </>
    )
}

export default Home
