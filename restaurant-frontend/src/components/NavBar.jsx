import React, { useState } from 'react';
import { User, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.jpeg";
import Cart from "../assets/cart.png";

const NavBar = () => {
  const [menu, setMenu] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  // Updated menu order: moved 'about' to 5th position (end)
  const menuItems = ['home', 'menu', 'preorder', 'table reservation', 'about'];

  const handleMenuClick = (item) => {
    setMenu(item);
    setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
    
    // Navigation logic - Updated to use Homepage
    switch(item) {
      case 'home':
        navigate('/'); // This will load Homepage.jsx
        break;
      case 'menu':
        navigate('/menu');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'preorder':
        navigate('/preorder');
        break;
      case 'table reservation':
        navigate('/table-reservation');
        break;
      default:
        navigate('/'); // Default to Homepage
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav 
        className="fixed top-0 w-full flex items-center h-20 z-50 shadow-md px-4 md:px-10" 
        style={{ backgroundColor: '#78D860' }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logo}
            alt="logo" 
            className="w-12 h-12 md:w-15 md:h-15 rounded-full cursor-pointer"
            onClick={() => handleMenuClick('home')} // Will navigate to Homepage
          />
        </div>

        {/* Desktop Menu Items */}
        <ul className="hidden md:flex m-0 p-0 list-none font-semibold text-lg flex-1 justify-center gap-5 lg:gap-8">
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => handleMenuClick(item)}
              className={`cursor-pointer capitalize transition-all duration-300 ${
                menu === item 
                  ? 'pb-0.5 border-b-2' 
                  : 'hover:text-blue-500 text-gray-700'
              }`}
              style={menu === item ? { 
                borderBottomColor: '#49557e',
                color: '#49557e' 
              } : {}}
            >
              {item === 'table reservation' ? 'Table Reservation' : 
               item === 'about' ? 'About Us' :
               item === 'preorder' ? 'Pre-Order' :
               item}
            </li>
          ))}
        </ul>

        {/* Desktop Right Side Icons - Removed Search Icon */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <div className="relative cursor-pointer">
            <img 
              src={Cart}
              alt="Cart" 
              className="w-6 h-6 lg:w-10 lg:h-10 hover:opacity-70 transition-opacity duration-300"
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white bg-red-500"></span>
          </div>

          <button 
            className="flex items-center gap-2 bg-transparent text-sm font-medium px-3 py-2 lg:px-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-opacity-100"
            style={{
              color: '#49557e',
              borderColor: '#49557e'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#49557e';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#49557e';
            }}
          >
            <User size={16} />
            <span className="hidden lg:inline">Sign In</span>
          </button>
        </div>

        {/* Mobile Menu Icons */}
        <div className="flex md:hidden items-center gap-3 ml-auto">
          {/* Mobile Cart Icon */}
          <div className="relative cursor-pointer">
            <img 
              src={Cart}
              alt="Cart" 
              className="w-6 h-6"
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white bg-red-500"></span>
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ color: '#49557e' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide Panel - Removed Search from mobile menu */}
      <div 
        className={`fixed top-20 right-0 h-screen w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#78D860' }}
      >
        <div className="flex flex-col p-6">
          {/* Mobile Menu Items */}
          <ul className="flex flex-col gap-6 mb-8">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => handleMenuClick(item)}
                className={`cursor-pointer capitalize font-semibold text-lg transition-all duration-300 ${
                  menu === item 
                    ? 'text-blue-800 border-l-4 border-blue-800 pl-4' 
                    : 'text-gray-700 hover:text-blue-500 pl-4'
                }`}
              >
                {item === 'table reservation' ? 'Table Reservation' : 
                 item === 'about' ? 'About Us' :
                 item === 'preorder' ? 'Pre-Order' :
                 item}
              </li>
            ))}
          </ul>

          {/* Mobile Sign In */}
          <button 
            className="flex items-center gap-3 bg-transparent font-medium px-4 py-3 border-2 rounded-lg cursor-pointer transition-all duration-300 mx-4"
            style={{
              color: '#49557e',
              borderColor: '#49557e'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#49557e';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#49557e';
            }}
          >
            <User size={20} />
            Sign In
          </button>
        </div>
      </div>

      {/* Add margin to body content to account for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default NavBar;