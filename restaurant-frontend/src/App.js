import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Import existing pages
import Homepage from './pages/Homepage'; // Changed from Home to Homepage
import AboutUs from './pages/AboutUs';
import ScrollToTop from './components/ScrollToTop';
import PreOrder from './pages/PreOrder';
import TableReservation from './pages/TableReservation';
import ChefLogin from './components/ChefLogin';
import AdminLogin from './components/AdminLogin';
import CustomerLogin from './pages/CustomerLogin';
import SignupScreen from './pages/SignupScreen';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChefDashboard from './pages/ChefDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LiveTracking from './pages/LiveTracking';
import PaymentGateway from './pages/PaymentGateway';
import Menu from './pages/Menu'; // Main menu with category navigation
import Cart from './pages/Cart';
import FeedbackPage from './pages/FeedbackPage';

// Import menu category pages
import Ramen from './pages/menu/Ramen';
import Rice from './pages/menu/Rice';
import Soup from './pages/menu/Soup';
import Drink from './pages/menu/Drink';
import More from './pages/menu/More';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (staff or customer)
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const customerUser = localStorage.getItem('customerUser');
    const customerToken = localStorage.getItem('customerToken');
    
    if ((savedUser && token) || (customerUser && customerToken)) {
      if (customerUser && customerToken) {
        // Customer is logged in
        setUser(JSON.parse(customerUser));
        setIsAuthenticated(true);
      } else if (savedUser && token) {
        // Staff is logged in
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    // userData is the full response with { success, message, token, user }
    const userObj = userData.user || userData;
    setUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('token', userData.token);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear both staff and customer tokens
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('customerUser');
    localStorage.removeItem('customerToken');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <CartProvider>
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<PaymentGateway />} />
          <Route path="/track-order" element={<LiveTracking />} />
          <Route path="/feedback/:orderId" element={<FeedbackPage />} />
          
          {/* Auth routes */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <CustomerLogin onLogin={handleLogin} />
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
          
          {/* Forgot Password routes */}
          <Route 
            path="/forgot-password" 
            element={
              !isAuthenticated ? (
                <ForgotPassword />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/reset-password" 
            element={
              !isAuthenticated ? (
                <ResetPassword />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Admin login component route */}
          <Route 
            path="/admin-login" 
            element={<AdminLogin onLogin={handleLogin} />}
          />
          
          <Route 
            path="/chef-dashboard" 
            element={
              loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                </div>
              ) : isAuthenticated && user?.role === 'chef' ? (
                <ChefDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/chef-login" replace />
              )
            } 
          />

          <Route 
            path="/chef-login" 
            element={<ChefLogin onLogin={handleLogin} />}
          />
          
          <Route 
            path="/admin-dashboard" 
            element={
              loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                </div>
              ) : isAuthenticated && (user?.role === 'admin' || user?.role === 'waiter') ? (
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
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;