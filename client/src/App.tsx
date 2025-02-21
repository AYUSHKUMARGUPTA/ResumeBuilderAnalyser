import React from 'react'
import { useAuth } from 'contexts/AuthContext'
import AuthModal from 'components/AuthModal'
import ResumeBuilder from "components/ResumeBuilder";
import ResumeAnalyzer from "components/ResumeAnalyzer";
import ResumeDetails from "components/ResumeDetails"; 
import Header from 'components/Header'
import 'styles/ReactWelcome.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    // <div className='App'>
    //   <Header />
    //   <LoggedInStatus />
    //   <AuthModal />
    // </div>
    <Router>
      <Header />
      <LoggedInStatus />
      <Routes>
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/resume-details" element={<ResumeDetails />} />
        <Route path="/resume-details/:id" element={<ResumeDetails />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/" element={<h2>Welcome to the Web App</h2>} />
      </Routes>
      <AuthModal />
    </Router>
  )
}


const LoggedInStatus = () => {
  const { isLoggedIn, account } = useAuth()

  if (isLoggedIn && !!account) {
    return <p>Hey, {account.username}! I'm happy to let you know: you are authenticated!</p>
  }

  return <p>Don't forget to start your backend server, and then authenticate yourself.</p>
}

export default App