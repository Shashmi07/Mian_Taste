// src/App.js
import React from "react";
import noodlesImg from "../assets/spisy.png"; 
import NavBar from "../components/NavBar"; // Fixed import path

const PreOrder = () => {
  return (
    <div>
      <NavBar />

      <div className="font-sans bg-gray-50 min-h-screen flex items-center justify-center">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-center px-6 py-16">
          
          {/* Image */}
          <div> 
            <img
              src={noodlesImg}
              alt="Korean-Japanese Fusion Noodles"
              className="w-[350px] h-[350px] object-cover rounded-full shadow-lg"
            />
          </div>

          {/* Text Content */}
          <div className="md:ml-16 mt-8 md:mt-0 max-w-lg">
            <p className="text-gray-600 text-lg">Welcome to</p>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
              Mian Taste <br /> Restaurant
            </h1>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Delve into the rich flavors of authentic Korean-Japanese fusion cuisine, ready for
              you to savor and enjoy. Experience the perfect blend of traditional techniques and modern innovation.
            </p>
            <div className="flex gap-4 mt-6">
              <button 
                className="px-6 py-2 text-white font-medium rounded-full shadow-md transition-colors"
                style={{ backgroundColor: '#78D860' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5BC142'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#78D860'}
                onClick={() => window.location.href = '/menu'}
              >
                Order Now
              </button>
              <button 
                className="px-6 py-2 border-2 text-gray-700 font-medium rounded-full shadow-md transition-colors hover:bg-gray-50"
                style={{ borderColor: '#78D860' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#78D860';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#374151';
                }}
                onClick={() => window.location.href = '/about'}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Quick Features */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍜</span>
              <span>Authentic Ramen</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🥟</span>
              <span>Fresh Dumplings</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚚</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrder;
