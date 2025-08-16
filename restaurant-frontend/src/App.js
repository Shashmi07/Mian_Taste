import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import TableReservation from './pages/TableReservation';
import ChefDashboard from './pages/ChefDashboard';
import LiveTracking from './pages/LiveTracking';
import PaymentGateway from './pages/PaymentGateway';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setIsAuthenticated(true);
    setUser(userData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Homepage - Public route */}
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          
          {/* Table Reservation - Public route */}
          <Route path="/table-reservation" element={<TableReservation />} />
          
          {/* Payment Gateway - Public route */}
          <Route path="/payment" element={<PaymentGateway />} />
          
          {/* Live tracking - Public route */}
          <Route path="/track-order" element={<LiveTracking />} />
          
          {/* Login route */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/chef-dashboard" replace />
              )
            } 
          />
          
          {/* Chef Dashboard - Protected route */}
          <Route 
            path="/chef-dashboard" 
            element={
              isAuthenticated ? (
                <ChefDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;