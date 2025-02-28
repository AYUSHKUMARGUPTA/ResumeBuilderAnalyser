import React from "react";
import AuthModal from "components/AuthModal";
import ResumeBuilder from "pages/ResumeBuilder";
import Header from "components/Header";
import "styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "pages/Home";
import ResumeDetails from "pages/ResumeDetails";
import UploadPage from "pages/UploadPage";
const App = () => {
  return (
    <Router>
      <Header />
      <div className="page-container">
        <Routes>
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/resume-details" element={<ResumeDetails />} />
          <Route path="/resume-details/:id" element={<ResumeDetails />} />
          <Route path="/resume-analyzer" element={<UploadPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <AuthModal />
      </div>
    </Router>
  );
};

export default App;
