import React from 'react';
import NavBar from '../../Components/NavBar';
import MenuCategary from '../../Components/MenuCategary';


import eggRamen from '../../assets/eggRamen.jpg';
import chickenRamen from '../../assets/chickenRamen.jpg';
import porkRamen from '../../assets/porkRamen.jpg';
import beefRamen from '../../assets/beefRamen.jpg';
import veganRamen from '../../assets/veganRamen.jpeg';
import seafoodRamen from '../../assets/seafoodRamen.jpg';
import beefandPorkRamen from '../../assets/beefandPorkRamen.jpg';
import buldakChicken from '../../assets/buldakChicken.jpg';
import blackRamen from '../../assets/blackRamen.jpg';
import buldakPork from '../../assets/buldakPork.jpg';
import buldakBeef from '../../assets/buldakBeef.jpg';
import beefPorkBuldak from '../../assets/beefPorkBuldak.jpg';
import cheeseRamen from '../../assets/cheeseRamen.png';
import cheeseChicken from '../../assets/cheeseChicken.jpg';
import cheesePork from '../../assets/cheesePork.jpg';
import cheeseBeef from '../../assets/beefCheese.jpg';
import cheeseBeefPork from '../../assets/beefPork.jpg';


const menuItems = [
  { name: "Chicken Ramen", price: "RS.1100", image: chickenRamen, description: "Bowl of ramen with tender chicken" },
  { name: "Egg Ramen", price: "RS.950", image: eggRamen, description: "Delicious ramen with soft-boiled egg" },
  { name: "Pork Ramen", price: "RS.1300", image: porkRamen, description: "Bowl of ramen with juicy pork slices" },
  { name: "Beef Ramen", price: "RS.1500", image: beefRamen, description: "Delicious ramen with flavorful beef slices" },
  { name: "Vegan Ramen", price: "RS.850", image: veganRamen, description: "Fresh vegetables in light ramen broth" },
  { name: "Pork and Beef Ramen", price: "RS.1600", image: beefandPorkRamen, description: "Bowl of ramen with both pork and beef slices" },

  { name: "Buldak Chicken Ramen", price: "RS.1200", image: buldakChicken, description: "Spicy Buldak chicken ramen" },
  { name: "Buldak Black Ramen", price: "RS.950", image: blackRamen, description: "Spicy Buldak black ramen" },
  { name: "Buldak Pork Ramen", price: "RS.1300", image: buldakPork, description: "Spicy Buldak pork ramen" },
  { name: "Buldak Beef Ramen", price: "RS.1400", image: buldakBeef, description: "Spicy Buldak beef ramen" },
  { name: "Buldak Pork and Beef Ramen", price: "RS.1500", image: beefPorkBuldak, description: "Spicy Buldak pork and beef ramen" },

  {name:"Cheese Ramen", price:"RS.1000", image: cheeseRamen, description: "Creamy ramen topped with melted cheese"}, 
  {name:"Cheese Chicken Ramen", price:"RS.1250", image: cheeseChicken, description: "Delicious cheese ramen with tender chicken"},
  {name:"Cheese Pork Ramen", price:"RS.1350", image: cheesePork, description: "Delicious cheese ramen with pork slices"},
  {name:"Cheese Beef Ramen", price:"RS.1500", image: cheeseBeef, description: "Creamy cheese ramen with flavorful beef"},
  {name:"Cheese Beef and Pork Ramen", price:"RS.1600", image: cheeseBeefPork, description: "Cheese ramen with both beef and pork slices"}

];

const Menu = () => {
  return (
    <div>
      <NavBar />

      <MenuCategary />
     
    
        {/* Menu Items */}
        <div className="grid grid-cols-5 gap-6 ml-0 mt-4">
          {menuItems
            .filter(item => !["Ramen", "Rice", "Juice", "Soup"].includes(item.name))
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
  );
};

export default Menu;