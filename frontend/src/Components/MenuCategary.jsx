import React from 'react'
import { Link } from 'react-router-dom';


const MenuCategary = () => {
  return (
    <div>
        {/* Main Content */}
      <main className="max-w-full mx-auto px-6 py-4 mt-16"></main>

       {/* Category Buttons */}
        <div className="flex justify-center gap-6 mb-6">
          <Link to="/ramen" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center"> Ramen</Link>
          <Link to="/rice" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Fried Rice</Link>
          <Link to="/drink" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Drinks</Link>
          <Link to="/soup" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Soup</Link>
          <button className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Desserts</button>
          <Link to="/more" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">More</Link>
        </div>
    </div>
  )
}

export default MenuCategary
