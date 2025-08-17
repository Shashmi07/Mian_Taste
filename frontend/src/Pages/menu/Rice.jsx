import React from 'react'
import NavBar from '../../Components/NavBar'
import MenuCategary from '../../Components/MenuCategary'


import chickenFriedRice from '../../assets/rice.png'
import eggRice from '../../assets/eggRice.png'
import vegetableRice from '../../assets/vegetableRice.jpg'
import porkRice from '../../assets/porkRice.jpg'
import beefRice from '../../assets/beefRice.jpg'
import porkAndBeefRice from '../../assets/beefPorkRice.jpg'




const riceItem=[
    { name: "Chicken Fried Rice", price: "RS.1100", image: chickenFriedRice, description: "Delicious fried rice with chicken" },
    { name: "Vegetable Fried Rice", price: "RS.950", image: vegetableRice, description: "Fried rice with fresh vegetables" },
    { name: "Egg Fried Rice", price: "RS.950", image: eggRice, description: "Golden fried rice with fluffy egg" },
    { name: "Pork Fried Rice", price: "RS.1300", image: porkRice, description: "Savory rice with  pork pieces" },
    { name: "Beef Fried Rice", price: "RS.1500", image: beefRice, description: "Fried rice with flavorful beef" },
    { name: "Vegan Fried Rice", price: "RS.850", image: porkAndBeefRice, description: "Tasty mix of beef and pork in fried rice" },
    
]

const Rice = () => {
  return (
    <div>
        <NavBar/>
        <MenuCategary />

         {/* Menu Items */}
        <div className="grid grid-cols-5 gap-6 ml-0 mt-4">
          {riceItem.map((item, idx) => (
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
  );
};

export default Rice
