import React from 'react'
import NavBar from '../Components/NavBar'
import home from '../assets/home.jpg'

import rice from '../assets/rice.png'


import RamenNoodles from '../assets/RamenNoodles.jpg'
import juice from '../assets/juice.jpg'

const Home = () => {
  return (
    <div>
      <NavBar />

      {/* Full-Width Banner Image */}
      <div
        className="w-full h-[800px] mb-12 mt-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${home})`, top: '80px' }}
      >
      </div>

      {/* Categories */}
      <div className="mb-8 mt-[150px] relative z-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Categories</h3>
        <div className="grid grid-cols-3 gap-6">

          {/* Ramen Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-full h-[550px] mb-4 flex items-center justify-center">
              <img
                src={RamenNoodles}
                alt="Ramen Noodles"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-gray-600 font-medium">Ramen</p>
          </div>

          {/* Juice Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-full h-[550px] bg-gradient-to-r from-green-400 to-orange-400 rounded-xl mb-4 flex items-center justify-center">
              <img
                src={juice}
                alt="Juice"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-gray-600 font-medium">Juice</p>
          </div>

          {/* Rice Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-full h-[550px] bg-gradient-to-b from-red-500 to-red-700 rounded-xl mb-4 flex items-center justify-center">
              <img
                src={rice}
                alt="rice"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-gray-600 font-medium">Rice</p>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      
    </div>
  )
}

export default Home