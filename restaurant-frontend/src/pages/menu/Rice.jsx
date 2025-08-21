import React, { useState, useEffect } from 'react'
import NavBar from '../../components/NavBar' // Fixed: components (lowercase)
import MenuCategary from '../../components/MenuCategary' // Fixed: components (lowercase)

// Image imports for mapping
import chickenFriedRice from '../../assets/rice.png'
import eggRice from '../../assets/eggRice.png'
import vegetableRice from '../../assets/vegetableRice.jpg'
import porkRice from '../../assets/porkRice.jpg'
import beefRice from '../../assets/beefRice.jpg'
import porkAndBeefRice from '../../assets/beefPorkRice.jpg'

// Image mapping for dynamic image loading
const imageMap = {
  'rice.png': chickenFriedRice,
  'vegetableRice.jpg': vegetableRice,
  'eggRice.png': eggRice,
  'porkRice.jpg': porkRice,
  'beefRice.jpg': beefRice,
  'beefPorkRice.jpg': porkAndBeefRice
};

const Rice = () => {
  const [riceItems, setRiceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRiceItems();
  }, []);

  const fetchRiceItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menu/category/rice');
      if (!response.ok) {
        throw new Error('Failed to fetch rice items');
      }
      const data = await response.json();
      setRiceItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getImageSrc = (imageName) => {
    return imageMap[imageName] || chickenFriedRice; // fallback image
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <MenuCategary />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading rice items...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <MenuCategary />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <NavBar/>
        <MenuCategary />

         {/* Menu Items */}
        <div className="grid grid-cols-5 gap-6 ml-0 mt-4">
          {riceItems.map((item, idx) => (
            <div key={item._id || idx} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
              <img 
                src={getImageSrc(item.image)} 
                alt={item.name} 
                className="w-full h-[250px] object-cover rounded-xl mb-4" 
              />
              <h4 className="font-bold text-lg text-center">{item.name}</h4>
              <p className="text-small text-center">{item.description}</p>
              <p className="text-green-600 font-semibold text-center">RS.{item.price}</p>
              <button className="w-full mt-4 px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
     
    </div>
  );
};

export default Rice
