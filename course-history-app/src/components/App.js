import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';
import Terms from './Terms';
import Privacy from './Privacy';
import Footer from './Footer';

function AppContent() {
  const [showAuth, setShowAuth] = useState(true);
  const { currentUser, logout } = useAuth();

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleBackToHome = () => {
    setShowAuth(false);
  };

  const handleShowAuth = () => {
    setShowAuth(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowAuth(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (currentUser ) {
    return (
      <div className="app-with-footer">
        <Dashboard 
          onLogout={handleLogout}
          onShowAuth={handleShowAuth}
        />
        <Footer />
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className="app-with-footer">
        <Auth 
          onBack={handleBackToHome}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-with-footer">
      <div className="app">
        <div className="title-container">
          <h1 className="main-title">Course History App</h1>
          <h2 className="subtitle">A tool to effectively see courses people in your organization have taken and relevant courses to you.</h2>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
