 import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Star } from 'lucide-react';

// Image imports for menu items
import chickenRamen from '../../assets/chickenRamen.jpg';
import eggRamen from '../../assets/eggRamen.jpg';
import porkRamen from '../../assets/porkRamen.jpg';
import beefRamen from '../../assets/beefRamen.jpg';
import seafoodRamen from '../../assets/SeafoodRamen.jpg';
import veganRamen from '../../assets/veganRamen.jpeg';
import blackRamen from '../../assets/blackRamen.jpg';
import cheeseRamen from '../../assets/cheeseRamen.png';
import beefandPorkRamen from '../../assets/beefandPorkRamen.jpg';
import buldakChicken from '../../assets/buldakChicken.jpg';
import buldakBeef from '../../assets/buldakBeef.jpg';
import buldakPork from '../../assets/buldakPork.jpg';
import buldakBeefPork from '../../assets/buldakBeefPork.jpg';
import beefPorkBuldak from '../../assets/beefPorkBuldak.jpg';
import cheeseChicken from '../../assets/cheeseChicken.jpg';
import cheesePork from '../../assets/cheesePork.jpg';
import beefPork from '../../assets/beefPork.jpg';
import beefCheese from '../../assets/beefCheese.jpg';
import eggRice from '../../assets/eggRice.png';
import beefRice from '../../assets/beefRice.jpg';
import porkRice from '../../assets/porkRice.jpg';
import vegetableRice from '../../assets/vegetableRice.jpg';
import beefPorkRice from '../../assets/beefPorkRice.jpg';
import chickenSoup from '../../assets/chickenSoup.jpg';
import beefSoup from '../../assets/beefSoup.jpg';
import porkSoup from '../../assets/porkSoup.jpg';
import eggSoup from '../../assets/eggSoup.jpg';
import beefPorkSoup from '../../assets/beefPorkSoup.jpg';
import cocacola from '../../assets/cocacola.jpg';
import sprite from '../../assets/sprite.jpeg';
import orangeJuice from '../../assets/orangeJuice.jpg';
import gingerBeer from '../../assets/gingerBeer.png';
import ramenDefault from '../../assets/ramen.jpg';

// Image mapping for dynamic image loading
const imageMap = {
  'chickenRamen.jpg': chickenRamen,
  'eggRamen.jpg': eggRamen,
  'porkRamen.jpg': porkRamen,
  'beefRamen.jpg': beefRamen,
  'SeafoodRamen.jpg': seafoodRamen,
  'veganRamen.jpeg': veganRamen,
  'blackRamen.jpg': blackRamen,
  'cheeseRamen.png': cheeseRamen,
  'beefandPorkRamen.jpg': beefandPorkRamen,
  'buldakChicken.jpg': buldakChicken,
  'buldakBeef.jpg': buldakBeef,
  'buldakPork.jpg': buldakPork,
  'buldakBeefPork.jpg': buldakBeefPork,
  'beefPorkBuldak.jpg': beefPorkBuldak,
  'cheeseChicken.jpg': cheeseChicken,
  'cheesePork.jpg': cheesePork,
  'beefPork.jpg': beefPork,
  'beefCheese.jpg': beefCheese,
  'eggRice.png': eggRice,
  'beefRice.jpg': beefRice,
  'porkRice.jpg': porkRice,
  'vegetableRice.jpg': vegetableRice,
  'beefPorkRice.jpg': beefPorkRice,
  'chickenSoup.jpg': chickenSoup,
  'beefSoup.jpg': beefSoup,
  'porkSoup.jpg': porkSoup,
  'eggSoup.jpg': eggSoup,
  'beefPorkSoup.jpg': beefPorkSoup,
  'cocacola.jpg': cocacola,
  'sprite.jpeg': sprite,
  'orangeJuice.jpg': orangeJuice,
  'gingerBeer.png': gingerBeer
};

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState({});

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching menu items...');
      
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      const response = await fetch(`http://localhost:5000/api/menu?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched menu items:', data);
      setMenuItems(data);
      
      // Calculate category statistics
      const stats = { all: data.length };
      data.forEach(item => {
        const category = item.category; // Keep original case
        const lowerCategory = category.toLowerCase();
        stats[lowerCategory] = (stats[lowerCategory] || 0) + 1;
      });
      console.log('Category stats:', stats);
      setCategoryStats(stats);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !currentStatus })
      });
      
      if (response.ok) {
        // Update local state
        setMenuItems(items => 
          items.map(item => 
            item._id === id ? { ...item, available: !currentStatus } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories', count: categoryStats.all || 0 },
    { id: 'Ramen', name: 'Ramen', count: categoryStats.ramen || 0 },
    { id: 'Rice', name: 'Rice', count: categoryStats.rice || 0 },
    { id: 'Soup', name: 'Soup', count: categoryStats.soup || 0 },
    { id: 'Drinks', name: 'Drinks', count: categoryStats.drinks || 0 },
    { id: 'More', name: 'More', count: categoryStats.more || 0 }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Menu Management
          </h1>
          <p className="text-gray-600">Manage your restaurant menu items and pricing</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      <div className="chart-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full sm:w-80"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 text-lg mt-4">Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item._id} className="border border-green-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                <div className="relative h-48">
                <img
                  src={imageMap[item.image] || ramenDefault}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                    <span className={`status-badge ${item.available ? 'success' : 'error'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{item.rating || 4.5}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">{item.price}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleAvailability(item._id, item.available)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          item.available 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {item.available ? 'Disable' : 'Enable'}
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default MenuManagement;