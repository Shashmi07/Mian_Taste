import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar'; // Fixed: components (lowercase)
import MenuCategory from '../../components/MenuCategory'; // Fixed: components (lowercase)

// Image imports for mapping
import eggRamen from '../../assets/MenuItems/eggRamen.jpg';
import chickenRamen from '../../assets/MenuItems/chickenRamen.jpg';
import porkRamen from '../../assets/MenuItems/porkRamen.jpg';
import beefRamen from '../../assets/MenuItems/beefRamen.jpg';
import veganRamen from '../../assets/MenuItems/veganRamen.jpeg';
import seafoodRamen from '../../assets/MenuItems/SeafoodRamen.jpg';
import beefandPorkRamen from '../../assets/MenuItems/beefandPorkRamen.jpg';
import buldakChicken from '../../assets/MenuItems/buldakChicken.jpg';
import blackRamen from '../../assets/MenuItems/blackRamen.jpg';
import buldakPork from '../../assets/MenuItems/buldakPork.jpg';
import buldakBeef from '../../assets/MenuItems/buldakBeef.jpg';
import beefPorkBuldak from '../../assets/MenuItems/beefPorkBuldak.jpg';
import cheeseRamen from '../../assets/MenuItems/cheeseRamen.png';
import cheeseChicken from '../../assets/MenuItems/cheeseChicken.jpg';
import cheesePork from '../../assets/MenuItems/cheesePork.jpg';
import cheeseBeef from '../../assets/MenuItems/beefCheese.jpg';
import cheeseBeefPork from '../../assets/MenuItems/beefPork.jpg';

// Image mapping for dynamic image loading
const imageMap = {
  'chickenRamen.jpg': chickenRamen,
  'eggRamen.jpg': eggRamen,
  'porkRamen.jpg': porkRamen,
  'beefRamen.jpg': beefRamen,
  'SeafoodRamen.jpg': seafoodRamen,
  'veganRamen.jpeg': veganRamen,
  'beefandPorkRamen.jpg': beefandPorkRamen,
  'buldakChicken.jpg': buldakChicken,
  'blackRamen.jpg': blackRamen,
  'buldakPork.jpg': buldakPork,
  'buldakBeef.jpg': buldakBeef,
  'beefPorkBuldak.jpg': beefPorkBuldak,
  'cheeseRamen.png': cheeseRamen,
  'cheeseChicken.jpg': cheeseChicken,
  'cheesePork.jpg': cheesePork,
  'beefCheese.jpg': cheeseBeef,
  'beefPork.jpg': cheeseBeefPork
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRamenItems();
  }, []);

  const fetchRamenItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menu/category/ramen');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getImageSrc = (imageName) => {
    return imageMap[imageName] || chickenRamen; // fallback image
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <MenuCategory />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading menu items...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <MenuCategory />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />

      <MenuCategory />
     
    
        {/* Menu Items */}
        <div className="grid grid-cols-5 gap-6 ml-0 mt-4">
          {menuItems.map((item, idx) => (
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

export default Menu;