import React from 'react';
import MenuCategory from '../../components/MenuCategory'; // Fixed: components (lowercase)
import NavBar from '../../components/NavBar'; // Fixed: components (lowercase)

import chickenSoup from '../../assets/MenuItems/chickenSoup.jpg'
import beefSoup from '../../assets/MenuItems/beefSoup.jpg'
import porkSoup from '../../assets/MenuItems/porkSoup.jpg'
import beefPorkSoup from '../../assets/MenuItems/beefPorkSoup.jpg'

const soupItem = [
    { name: "Chicken Soup", price: "RS.400", image: chickenSoup, description: "Warm soup with tender chicken" },
    { name: "Pork Soup", price: "RS.500", image: porkSoup, description: "Classic pork soup" },
    { name: "Beef and Pork Soup", price: "RS.650", image: beefPorkSoup, description: "Soup with mix of pork and beef" },
    { name: "Beef Soup", price: "RS.600", image: beefSoup, description: " Beef soup with vegetables" },
];

const Soup = () => {
  return (
    <div>
        <NavBar/>
        <MenuCategory/>

        {/* Menu Items */}
        <div className="grid grid-cols-5 gap-6 ml-0 mt-4">
          {soupItem.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
              <img src={item.image} alt={item.name} className="w-full h-[250px] object-cover rounded-xl mb-4" />
              <h4 className="font-bold text-lg text-center">{item.name}</h4>
              <p className="text-small text-center">{item.description} </p>
              <p className="text-green-600 font-semibold text-center">{item.price}</p>
              <button className="w-full mt-4 px-6 py-2 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>

    </div>
  )
}

export default Soup
