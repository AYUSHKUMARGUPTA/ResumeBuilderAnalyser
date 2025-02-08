import React from "react";
import { useAuth } from "contexts/AuthContext";
import AuthModal from "components/AuthModal";
import ResumeBuilder from "components/ResumeBuilder";
// import ResumeAnalyzer from "components/ResumeAnalyzer";
import Header from "components/Header";
import "styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "components/UploadPage";
import Home from "pages/Home";
const App = () => {
  return (
    <Router>
      <Header />
      <div className="page-container">
        <LoggedInStatus />
        <Routes>
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/resume-analyzer" element={<UploadPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <AuthModal />
      </div>
    </Router>
  );
};

const LoggedInStatus = () => {
  const { isLoggedIn, account } = useAuth();

  if (isLoggedIn && !!account) {
    return (
      <p>
        Hey, {account.username}! I'm happy to let you know: you are
        authenticated!
      </p>
    );
  }

  return (
    <p>
      Don't forget to start your backend server, and then authenticate yourself.
    </p>
  );
};

export default App;
