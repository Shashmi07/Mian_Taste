import React from 'react';
import { Link } from 'react-router-dom';

const MenuCategory = () => {
  return (
    <div>
        {/* Main Content */}
      <main className="max-w-full mx-auto px-6 py-4 mt-16"></main>

       {/* Category Buttons - FIXED ROUTES */}
        <div className="flex justify-center gap-6 mb-6">
          <Link to="/menu/ramen" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Ramen</Link>
          <Link to="/menu/rice" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Fried Rice</Link>
          <Link to="/menu/drinks" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Drinks</Link>
          <Link to="/menu/soup" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Soup</Link>
          <button className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">Desserts</button>
          <Link to="/menu/more" className="w-[200px] px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition flex items-center justify-center">More</Link>
        </div>
    </div>
  );
};

export default MenuCategory;
