import React, { useState, useEffect } from 'react';
import { Star, Search, Clock } from 'lucide-react';
import NavBar from '../components/NavBar';

// Import all images from MenuItems folder and create mapping
import chickenRamen from '../assets/MenuItems/chickenRamen.jpg';
import eggRamen from '../assets/MenuItems/eggRamen.jpg';
import porkRamen from '../assets/MenuItems/porkRamen.jpg';
import beefRamen from '../assets/MenuItems/beefRamen.jpg';
import veganRamen from '../assets/MenuItems/veganRamen.jpeg';
import seafoodRamen from '../assets/MenuItems/SeafoodRamen.jpg';
import beefandPorkRamen from '../assets/MenuItems/beefandPorkRamen.jpg';
import buldakChicken from '../assets/MenuItems/buldakChicken.jpg';
import blackRamen from '../assets/MenuItems/blackRamen.jpg';
import buldakPork from '../assets/MenuItems/buldakPork.jpg';
import buldakBeef from '../assets/MenuItems/buldakBeef.jpg';
import beefPorkBuldak from '../assets/MenuItems/beefPorkBuldak.jpg';
import cheeseRamen from '../assets/MenuItems/cheeseRamen.png';
import cheeseChicken from '../assets/MenuItems/cheeseChicken.jpg';
import cheesePork from '../assets/MenuItems/cheesePork.jpg';
import cheeseBeef from '../assets/MenuItems/beefCheese.jpg';
import cheeseBeefPork from '../assets/MenuItems/beefPork.jpg';

// Rice images
import chickenFriedRice from '../assets/MenuItems/rice.png';
import eggRice from '../assets/MenuItems/eggRice.png';
import vegetableRice from '../assets/MenuItems/vegetableRice.jpg';
import porkRice from '../assets/MenuItems/porkRice.jpg';
import beefRice from '../assets/MenuItems/beefRice.jpg';
import porkAndBeefRice from '../assets/MenuItems/beefPorkRice.jpg';

// Soup images
import chickenSoup from '../assets/MenuItems/chickenSoup.jpg';
import beefSoup from '../assets/MenuItems/beefSoup.jpg';
import porkSoup from '../assets/MenuItems/porkSoup.jpg';
import beefPorkSoup from '../assets/MenuItems/beefPorkSoup.jpg';

// Drink images
import coke from '../assets/MenuItems/cocacola.jpg';
import sprite from '../assets/MenuItems/sprite.jpeg';
import gingerBeer from '../assets/MenuItems/gingerBeer.png';
import orange from '../assets/MenuItems/orangeJuice.jpg';
import watermelon from '../assets/MenuItems/watermelon.jpg';

// More images
import wooden from '../assets/MenuItems/wooden.jpg';
import bamboo from '../assets/MenuItems/bamboo.jpg';

// Default image for fallback
import ramenDefault from '../assets/ramen.jpg';

// Create image mapping
const imageMap = {
  // Ramen images
  'chickenRamen.jpg': chickenRamen,
  'eggRamen.jpg': eggRamen,
  'porkRamen.jpg': porkRamen,
  'beefRamen.jpg': beefRamen,
  'veganRamen.jpeg': veganRamen,
  'SeafoodRamen.jpg': seafoodRamen,
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
  'beefPork.jpg': cheeseBeefPork,
  
  // Rice images
  'rice.png': chickenFriedRice,
  'eggRice.png': eggRice,
  'vegetableRice.jpg': vegetableRice,
  'porkRice.jpg': porkRice,
  'beefRice.jpg': beefRice,
  'beefPorkRice.jpg': porkAndBeefRice,
  
  // Soup images
  'chickenSoup.jpg': chickenSoup,
  'beefSoup.jpg': beefSoup,
  'porkSoup.jpg': porkSoup,
  'beefPorkSoup.jpg': beefPorkSoup,
  
  // Drink images
  'cocacola.jpg': coke,
  'sprite.jpeg': sprite,
  'gingerBeer.png': gingerBeer,
  'orangeJuice.jpg': orange,
  'watermelon.jpg': watermelon,
  
  // More images
  'wooden.jpg': wooden,
  'bamboo.jpg': bamboo
};

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu items from database
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/menu');
        if (response.ok) {
          const data = await response.json();
          setAllMenuItems(data);
        } else {
          console.error('Failed to fetch menu items');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Helper function to get image from mapping
  const getItemImage = (imageName) => {
    return imageMap[imageName] || ramenDefault;
  };

  const categories = ['All', 'Ramen', 'Rice', 'Soup', 'Drinks', 'More'];

  // Filter items based on active category and search term
  const filteredItems = allMenuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
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
        {loading ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading menu items...</h3>
            <p className="text-gray-500">Please wait while we fetch the latest menu</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No items match "${searchTerm}"` : 'No items in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                
                {/* Image with Heart Icon */}
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={getItemImage(item.image)} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  {/* Heart Icon - Top Right */}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  
                  {/* Item Name */}
                  <h4 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                    {item.name}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {item.description || 'Delicious and freshly prepared'}
                  </p>
                  
                  {/* Rating and Time Row - Only for food items */}
                  {(item.category === 'Ramen' || item.category === 'Rice' || item.category === 'Soup') && (
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {renderStars(item.rating || 4.5)}
                        <span className="ml-1 font-medium text-gray-900">{item.rating || 4.5}</span>
                      </div>
                      
                      {/* Cooking Time */}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>15-20 min</span>
                      </div>
                    </div>
                  )}

                  {/* For non-food items, add some spacing */}
                  {!(item.category === 'Ramen' || item.category === 'Rice' || item.category === 'Soup') && (
                    <div className="mb-4"></div>
                  )}
                  
                  {/* Price and Add to Cart Row */}
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold" style={{ color: '#46923c' }}>
                      {item.price}
                    </div>
                    
                    <button 
                      className="px-6 py-2 text-white font-semibold rounded-full transition-colors duration-300"
                      style={{ backgroundColor: '#46923c' }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#5BC142';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#46923c';
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;