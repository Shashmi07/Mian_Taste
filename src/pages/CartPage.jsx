import React, { useState } from 'react';
import { Car, Minus, Plus, Trash2 } from 'lucide-react';
import NavBar from '../Components/NavBar';


const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Thakali Ramen', price: 390, quantity: 1, image: '/api/placeholder/80/80' },
    { id: 2, name: 'Thakali Ramen', price: 390, quantity: 1, image: '/api/placeholder/80/80' },
    { id: 3, name: 'Thakali Ramen', price: 390, quantity: 1, image: '/api/placeholder/80/80' },
    { id: 4, name: 'Thakali Ramen', price: 390, quantity: 1, image: '/api/placeholder/80/80' },
    { id: 5, name: 'Thakali Ramen', price: 390, quantity: 1, image: '/api/placeholder/80/80' },
    { id: 6, name: 'Thakali Ramen', price: 390, quantity: 1, image: '/api/placeholder/80/80' },
    { id: 7, name: 'Thakali Ramen', price: 390, quantity: 1, image: '/api/placeholder/80/80' },
    { id: 8, name: 'Thakali Ramen', price: 390, quantity: 1, image: '/api/placeholder/80/80' }
  ]);

  const [orderType, setOrderType] = useState('dine-in');

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = subtotal * 0.1;
  const total = subtotal + taxAmount;

  return (
    <div className="w-screen  h-auto overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 pt-[64px]">
      <NavBar />
      

      {/* Header */}
      <div className="py-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800">My Cart</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] px-6 pb-6 gap-6">
        {/* Left Side - Cart Items */}
        <div className="flex flex-col w-full p-6 bg-white shadow-lg md:w-3/5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
            <span className="text-base text-gray-500">({cartItems.length} items)</span>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="flex items-center justify-center flex-1 text-gray-400">
              <div className="text-center">
                <div className="mb-4 text-6xl">🛒</div>
                <p className="text-xl">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 pr-2 overflow-y-scroll cart-scrollbar">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 transition-all duration-200 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg">
                        <span className="text-2xl">🍜</span>
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-800 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600">Rs. {item.price.toFixed(2)}</p>
                      </div>
                      
                      {/* Quantity */}
                      <div className="flex items-center gap-2 p-1 bg-white border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex items-center justify-center w-8 h-8 transition-colors bg-yellow-400 rounded-md hover:bg-yellow-500"
                        >
                          <Minus size={14} className="text-white" />
                        </button>
                        <span className="w-6 text-base font-medium text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex items-center justify-center w-8 h-8 transition-colors bg-yellow-400 rounded-md hover:bg-yellow-500"
                        >
                          <Plus size={14} className="text-white" />
                        </button>
                      </div>
                      
                      {/* Total & Delete */}
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800 text-base min-w-[80px] text-right">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-400 transition-all duration-200 rounded-md hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Order Details */}
        <div className="flex flex-col w-full gap-6 md:w-2/5">
          {/* Order Type */}
          <div className="p-6 bg-white shadow-lg rounded-2xl">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Select Order Type</h3>
            <div className="space-y-3">
              {['dine-in', 'take-away', 'delivery'].map(type => (
                <label key={type} className="flex items-center gap-4 p-3 transition-all duration-200 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="orderType"
                    value={type}
                    checked={orderType === type}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-5 h-5 text-yellow-500 border-gray-300 focus:ring-yellow-400 focus:ring-2"
                  />
                  <span className="text-base font-medium text-gray-700">
                    {type === 'delivery' ? 'Delivery (Flexible Charge)' : type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="flex flex-col p-3 shadow-lg bg-gradient-to-b from-white to-gray-50 rounded-2xl">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Price Details</h3>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-700">Subtotal</span>
                <span className="text-base font-medium text-gray-800">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-700">Discount</span>
                <span className="text-base font-medium text-green-600">Rs. 0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-700">Tax (10%)</span>
                <span className="text-base font-medium text-gray-800">Rs. {taxAmount.toFixed(2)}</span>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span className="text-lg font-semibold text-gray-800">Order Total</span>
                <span className="text-lg font-medium text-yellow-600">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              className="w-full px-8 py-4 mt-auto text-lg font-semibold text-white transition-all duration-200 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cartItems.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .cart-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d4d4d4 #f3f4f6;
        }
        .cart-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .cart-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .cart-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 3px;
        }
        .cart-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b3b3b3;
        }
      `}</style>
    </div>
  );
};

export default CartPage;