import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import existing pages
import Homepage from './pages/Homepage'; // Changed from Home to Homepage
import AboutUs from './pages/AboutUs';
import ScrollToTop from './components/ScrollToTop';
import PreOrder from './pages/PreOrder';
import TableReservation from './pages/TableReservation';
import Login from './components/Login';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import ChefDashboard from './pages/ChefDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LiveTracking from './pages/LiveTracking';
import PaymentGateway from './pages/PaymentGateway';
import Menu from './pages/Menu'; // Main menu with category navigation

// Import menu category pages
import Ramen from './pages/menu/Ramen';
import Rice from './pages/menu/Rice';
import Soup from './pages/menu/Soup';
import Drink from './pages/menu/Drink';
import More from './pages/menu/More';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  return (
    <Router>
        <ScrollToTop />
      <div className="App">
        <Routes>
          {/* Main pages - Updated to use Homepage */}
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/preorder" element={<PreOrder />} />
          <Route path="/table-reservation" element={<TableReservation />} />
          
          {/* Menu pages - each category shows only its items */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/ramen" element={<Ramen />} />
          <Route path="/menu/rice" element={<Rice />} />
          <Route path="/menu/soup" element={<Soup />} />
          <Route path="/menu/drinks" element={<Drink />} />
          <Route path="/menu/more" element={<More />} />
          
          {/* Backend pages */}
          <Route path="/payment" element={<PaymentGateway />} />
          <Route path="/track-order" element={<LiveTracking />} />
          
          {/* Auth routes */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <LoginScreen onLogin={handleLogin} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              !isAuthenticated ? (
                <SignupScreen />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Legacy login component route */}
          <Route 
            path="/admin-login" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/admin-dashboard" replace />
              )
            } 
          />
          
          <Route 
            path="/chef-dashboard" 
            element={
              isAuthenticated ? (
                <ChefDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            } 
          />
          
          <Route 
            path="/admin-dashboard" 
            element={
              isAuthenticated ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;