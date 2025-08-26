import React, { useState } from 'react';
import { User } from 'lucide-react';
import logo from "../assets/logo.jpeg";
import Search from "../assets/search.png";
import Cart from "../assets/cart.png";

const NavBar = () => {
  const [menu, setMenu] = useState('home');
  const menuItems = ['home', 'menu', 'pre-order', 'table reservation', 'contact'];

  return (
    <nav 
      className="fixed top-0 w-full flex items-center h-20 z-50 shadow-md" 
      style={{ backgroundColor: '#78D860' }}
    >
      {/* Logo */}
      <div className="flex items-center ml-10">
        <img 
          src={logo} // Use imported Logo variable
          alt="logo" 
          style={{ width: '60px', height: '60px' }}
          className=" rounded-full cursor-pointer "
        />
      </div>

      {/* Menu Items */}
      <ul className="flex m-0 p-0 list-none font-semibold text-lg flex-1 justify-center" style={{ gap: '20px' }}>

        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => setMenu(item)}
            className={`cursor-pointer capitalize transition-all duration-300 ${
              menu === item 
                ? 'pb-0.5 border-b-2 ' 
                : 'hover:text-blue-500 text-gray-700'
            }`}
            style={menu === item ? { 
              borderBottomColor: '#49557e',
              color: '#49557e' 
            } : {}}
          >
            {item === 'pre-order'
              ? 'Pre-Order'
              : item === 'table reservation'
              ? 'Table Reservation'
              : item}
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-6 mr-10" style={{ transform: 'translateX(-20px)' }}>
        {/* Search Icon */}
        <img 
          src={Search} // Use imported Search variable
          alt="Search" 
          style={{ width: '50px', height: '50px' }}
          className="cursor-pointer hover:opacity-70 transition-opacity duration-300"
        />
        
        {/* Cart Icon */}
        <div className="relative cursor-pointer">
          <img 
            src={Cart} // Use imported Cart variable
            alt="Cart" 
            style={{ width: '40px', height: '40px' }}
            
            className="w-6 h-6 hover:opacity-70 transition-opacity duration-300"/>
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white"style={{ backgroundColor: 'red' }} ></span>
        </div>

        {/* Sign In Button */}
        <button 
          className="flex items-center gap-2 bg-transparent text-sm font-medium px-4 py-2 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-opacity-100"
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
          <User size={18} />
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default NavBar;