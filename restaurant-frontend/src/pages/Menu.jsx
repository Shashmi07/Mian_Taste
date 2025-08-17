import React, { useState } from 'react';
import { Star, Search } from 'lucide-react';
import NavBar from '../components/NavBar';

// Import all images
// Ramen images
import eggRamen from '../assets/eggRamen.jpg';
import chickenRamen from '../assets/chickenRamen.jpg';
import porkRamen from '../assets/porkRamen.jpg';
import beefRamen from '../assets/beefRamen.jpg';
import veganRamen from '../assets/veganRamen.jpeg';
import seafoodRamen from '../assets/SeafoodRamen.jpg';
import beefandPorkRamen from '../assets/beefandPorkRamen.jpg';
import buldakChicken from '../assets/buldakChicken.jpg';
import blackRamen from '../assets/blackRamen.jpg';
import buldakPork from '../assets/buldakPork.jpg';
import buldakBeef from '../assets/buldakBeef.jpg';
import beefPorkBuldak from '../assets/beefPorkBuldak.jpg';
import cheeseRamen from '../assets/cheeseRamen.png';
import cheeseChicken from '../assets/cheeseChicken.jpg';
import cheesePork from '../assets/cheesePork.jpg';
import cheeseBeef from '../assets/beefCheese.jpg';
import cheeseBeefPork from '../assets/beefPork.jpg';

// Rice images
import chickenFriedRice from '../assets/rice.png';
import eggRice from '../assets/eggRice.png';
import vegetableRice from '../assets/vegetableRice.jpg';
import porkRice from '../assets/porkRice.jpg';
import beefRice from '../assets/beefRice.jpg';
import porkAndBeefRice from '../assets/beefPorkRice.jpg';

// Soup images
import chickenSoup from '../assets/chickenSoup.jpg';
import beefSoup from '../assets/beefSoup.jpg';
import porkSoup from '../assets/porkSoup.jpg';
import beefPorkSoup from '../assets/beefPorkSoup.jpg';

// Drink images
import coke from '../assets/cocacola.jpg';
import sprite from '../assets/sprite.jpeg';
import gingerBeer from '../assets/gingerBeer.png';
import orange from '../assets/orangeJuice.jpg';

// More images
import wooden from '../assets/wooden.jpg';
import bamboo from '../assets/bamboo.jpg';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // All menu items with categories and ratings
  const allMenuItems = [
    // Ramen items
    { name: "Chicken Ramen", price: "RS.1100", image: chickenRamen, description: "Bowl of ramen with tender chicken", category: "Ramen", rating: 4.8 },
    { name: "Egg Ramen", price: "RS.950", image: eggRamen, description: "Delicious ramen with soft-boiled egg", category: "Ramen", rating: 4.5 },
    { name: "Pork Ramen", price: "RS.1300", image: porkRamen, description: "Bowl of ramen with juicy pork slices", category: "Ramen", rating: 4.9 },
    { name: "Beef Ramen", price: "RS.1500", image: beefRamen, description: "Delicious ramen with flavorful beef slices", category: "Ramen", rating: 4.7 },
    { name: "Seafood Ramen", price: "RS.1400", image: seafoodRamen, description: "Fresh seafood in savory ramen broth", category: "Ramen", rating: 4.6 },
    { name: "Vegan Ramen", price: "RS.850", image: veganRamen, description: "Fresh vegetables in light ramen broth", category: "Ramen", rating: 4.3 },
    { name: "Pork and Beef Ramen", price: "RS.1600", image: beefandPorkRamen, description: "Bowl of ramen with both pork and beef slices", category: "Ramen", rating: 4.9 },
    { name: "Buldak Chicken Ramen", price: "RS.1200", image: buldakChicken, description: "Spicy Buldak chicken ramen", category: "Ramen", rating: 4.8 },
    { name: "Buldak Black Ramen", price: "RS.950", image: blackRamen, description: "Spicy Buldak black ramen", category: "Ramen", rating: 4.4 },
    { name: "Buldak Pork Ramen", price: "RS.1300", image: buldakPork, description: "Spicy Buldak pork ramen", category: "Ramen", rating: 4.7 },
    { name: "Buldak Beef Ramen", price: "RS.1400", image: buldakBeef, description: "Spicy Buldak beef ramen", category: "Ramen", rating: 4.8 },
    { name: "Buldak Beef & Pork Ramen", price: "RS.1500", image: beefPorkBuldak, description: "Spicy Buldak pork and beef ramen", category: "Ramen", rating: 4.9 },
    { name: "Cheese Ramen", price: "RS.1000", image: cheeseRamen, description: "Creamy ramen topped with melted cheese", category: "Ramen", rating: 4.6 },
    { name: "Cheese Chicken Ramen", price: "RS.1250", image: cheeseChicken, description: "Delicious cheese ramen with tender chicken", category: "Ramen", rating: 4.8 },
    { name: "Cheese Pork Ramen", price: "RS.1350", image: cheesePork, description: "Delicious cheese ramen with pork slices", category: "Ramen", rating: 4.7 },
    { name: "Cheese Beef Ramen", price: "RS.1500", image: cheeseBeef, description: "Creamy cheese ramen with flavorful beef", category: "Ramen", rating: 4.9 },
    { name: "Cheese Beef and Pork Ramen", price: "RS.1600", image: cheeseBeefPork, description: "Cheese ramen with both beef and pork slices", category: "Ramen", rating: 4.8 },

    // Rice items
    { name: "Chicken Fried Rice", price: "RS.1100", image: chickenFriedRice, description: "Delicious fried rice with chicken", category: "Rice", rating: 4.5 },
    { name: "Vegetable Fried Rice", price: "RS.950", image: vegetableRice, description: "Fried rice with fresh vegetables", category: "Rice", rating: 4.2 },
    { name: "Egg Fried Rice", price: "RS.950", image: eggRice, description: "Golden fried rice with fluffy egg", category: "Rice", rating: 4.4 },
    { name: "Pork Fried Rice", price: "RS.1300", image: porkRice, description: "Savory rice with pork pieces", category: "Rice", rating: 4.6 },
    { name: "Beef Fried Rice", price: "RS.1500", image: beefRice, description: "Fried rice with flavorful beef", category: "Rice", rating: 4.7 },
    { name: "Beef & Pork Fried Rice", price: "RS.1600", image: porkAndBeefRice, description: "Tasty mix of beef and pork in fried rice", category: "Rice", rating: 4.8 },

    // Soup items
    { name: "Chicken Soup", price: "RS.400", image: chickenSoup, description: "Warm soup with tender chicken", category: "Soup", rating: 4.3 },
    { name: "Pork Soup", price: "RS.500", image: porkSoup, description: "Classic pork soup", category: "Soup", rating: 4.4 },
    { name: "Beef and Pork Soup", price: "RS.650", image: beefPorkSoup, description: "Soup with mix of pork and beef", category: "Soup", rating: 4.6 },
    { name: "Beef Soup", price: "RS.600", image: beefSoup, description: "Beef soup with vegetables", category: "Soup", rating: 4.5 },

    // Drink items
    { name: "Coke", price: "RS.120", image: coke, description: "Cocacola 250ml Bottle", category: "Drinks", rating: 4.2 },
    { name: "Ginger Beer", price: "RS.150", image: gingerBeer, description: "Ginger Beer 250ml Bottle", category: "Drinks", rating: 4.0 },
    { name: "Sprite", price: "RS.120", image: sprite, description: "Sprite 250ml Bottle", category: "Drinks", rating: 4.1 },
    { name: "Orange Juice", price: "RS.200", image: orange, description: "Freshly squeezed orange juice", category: "Drinks", rating: 4.5 },

    // More items
    { name: "Wooden Chopsticks", price: "RS.50", image: wooden, description: "One wooden chopstick", category: "More", rating: 4.0 },
    { name: "Bamboo Chopsticks", price: "RS.100", image: bamboo, description: "One bamboo chopstick", category: "More", rating: 4.3 },
  ];

  const categories = ['All', 'Ramen', 'Rice', 'Soup', 'Drinks', 'More'];

  // Filter items based on active category and search term
  const filteredItems = allMenuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={i} 
          className="w-4 h-4 fill-yellow-400 text-yellow-400" 
        />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="w-4 h-4 text-gray-300" 
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header with Search Bar */}
      <div className="bg-white shadow-sm sticky top-20 z-10 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar - Upper Right */}
          <div className="flex justify-end mb-6">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#46923c] focus:border-transparent text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer">×</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#46923c] text-white shadow-lg transform scale-105'
                    : 'text-gray-600 bg-gray-100 hover:bg-[#8bca84] hover:text-white'
                }`}
              >
                {category} {category !== 'All' && `(${allMenuItems.filter(item => item.category === category).length})`}
              </button>
            ))}
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Found <span className="font-semibold text-[#46923c]">{filteredItems.length}</span> items for "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No items match "${searchTerm}"` : 'No items in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden rounded-xl mb-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Rating Stars - Only show for Ramen, Rice, and Soup */}
                {(item.category === 'Ramen' || item.category === 'Rice' || item.category === 'Soup') && (
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {renderStars(item.rating)}
                    <span className="ml-2 text-sm font-semibold text-yellow-600">
                      {item.rating}
                    </span>
                  </div>
                )}
                
                <h4 className="font-bold text-lg text-center text-gray-900 mb-2">
                  {item.name}
                </h4>
                
                <p className="text-sm text-center text-gray-600 mb-3 leading-relaxed">
                  {item.description}
                </p>
                
                <p className="text-center font-bold text-lg mb-4" style={{ color: '#46923c' }}>
                  {item.price}
                </p>
                
                <button 
                  className="w-full py-3 bg-[#46923c] text-white rounded-full font-semibold hover:bg-[#8bca84] transition-colors duration-300"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;