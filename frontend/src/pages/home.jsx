import React from 'react'


import ramen from '../assets/ramen.jpg';
import orange from '../assets/orange.jpg';
import home from '../assets/home.jpg'; // Make sure 'home' image is imported

function GrandMinatoApp() {
  return (
    <div>
      

      {/* Full-width Home Image starts after Navbar */}
      <div className="relative w-full h-[800px] mt-20">
        <img
          src={home}
          alt="home"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Categories</h2>
        <div className="grid grid-cols-3 gap-6">

          {/* Ramen Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-full h-32 bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl mb-4 relative overflow-hidden">
              <div className="absolute inset-2 bg-gradient-to-b from-orange-200 to-orange-400 rounded-lg flex items-center justify-center">
                <img
                  src={ramen}
                  alt="ramen"
                  className="w-16 h-16 object-cover rounded-full"
                />
              </div>
            </div>
            <p className="text-center text-gray-600 font-medium">Ramen</p>
          </div>

          {/* Juice Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
  <div className="w-full h-32 bg-gradient-to-r from-green-400 to-orange-400 rounded-xl mb-4 relative overflow-hidden">
    <div className="absolute inset-2 bg-gradient-to-b from-green-200 to-orange-200 rounded-lg flex items-center justify-center">
      <img
        src={orange}
        alt="orange"
        className="w-16 h-16 object-cover rounded-full"
      />
    </div>
  </div>
  <p className="text-center text-gray-600 font-medium">Juice</p>
</div>

          {/* Rice Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-full h-32 bg-gradient-to-b from-red-500 to-red-700 rounded-xl mb-4 flex items-center justify-center">
              <div className="text-3xl">🍛</div>
            </div>
            <p className="text-center text-gray-600 font-medium">Rice</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default GrandMinatoApp ;