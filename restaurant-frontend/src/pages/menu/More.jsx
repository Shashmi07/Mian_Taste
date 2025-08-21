import React from 'react'
import NavBar from '../../components/NavBar' // Fixed: components (lowercase)
import MenuCategary from '../../components/MenuCategary' // Fixed: components (lowercase)

import wooden from '../../assets/MenuItems/wooden.jpg'
import bamboo from '../../assets/MenuItems/bamboo.jpg'


const MoreItems = [
  { name: "Wooden chopstic", price: "RS.50", image: wooden, description: "One wooden chopstick" },
  { name: "Bamboo Chopstic", price: "RS.100", image: bamboo, description: "One bamboo chopstick" },
];

const More = () => {
  return (
    <div>
    <NavBar/>
    <MenuCategary/>

    <div className="grid grid-cols-5 gap-6 ml-0 mt-4">
          {MoreItems
            .map((item, idx) => (
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

export default More
