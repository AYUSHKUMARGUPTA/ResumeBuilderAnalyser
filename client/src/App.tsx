import React from "react";
import AuthModal from "components/AuthModal";
import ResumeBuilder from "pages/ResumeBuilder";
import Header from "components/Header";
import "styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "pages/UploadPage";
import Home from "pages/Home";
const App = () => {
  return (
    <Router>
      <Header />
      <div className="page-container">
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

export default App;
