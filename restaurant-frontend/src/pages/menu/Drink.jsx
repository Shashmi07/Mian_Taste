import React from 'react';
import MenuCategory from '../../components/MenuCategory'; // Fixed: components (lowercase)
import NavBar from '../../components/NavBar'; // Fixed: components (lowercase)
import { useCart } from '../../context/CartContext';

import coke from '../../assets/MenuItems/cocacola.jpg'
import sprite from '../../assets/MenuItems/sprite.jpeg'
import gingerBeer from '../../assets/MenuItems/gingerBeer.png'
import orange from '../../assets/MenuItems/orangeJuice.jpg'

const DrinkItems = [
    { name: "Coke", price: "RS.120", image: coke, description: "Cocacola 250ml Bottle" },
    { name: "Ginger Beer", price: "RS.150", image: gingerBeer, description: "Ginger Beer 250ml Bottle" },
    { name: "Sprite", price: "RS.120", image: sprite, description: "Sprite 250ml Bottle" },
    { name: "Orange Juice", price: "RS.200", image: orange, description: "Freshly squeezed orange juice" },
];

const Drink = () => {
  const { clearCart } = useCart();
  
  // Clear cart if user navigated back from cart page
  React.useEffect(() => {
    if (localStorage.getItem('visitedCart') === 'true') {
      console.log('User returned from cart - clearing cart');
      clearCart();
      localStorage.removeItem('visitedCart');
    }
  }, [clearCart]);
  
  // Set delivery context for direct visitors
  React.useEffect(() => {
    // If user is not from QR, preorder, or reservation - they are delivery customers
    const hasValidContext = localStorage.getItem('qrTableNumber') ||
                           localStorage.getItem('preorderContext') ||
                           localStorage.getItem('reservationContext');
    
    if (!hasValidContext) {
      localStorage.setItem('deliveryContext', 'true');
      console.log('Direct visitor - set as delivery order');
    }
  }, []);
  
  return (
    <div>
        <NavBar/>
        <MenuCategory/>

        {/* Menu Items */}
        <div className="grid grid-cols-5 gap-6 ml-0 mt-4">
          {DrinkItems
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

export default Drink
