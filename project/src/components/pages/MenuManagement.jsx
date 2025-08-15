import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Star } from 'lucide-react';

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [menuItems] = useState([
    {
      id: '1',
      name: 'Tonkotsu Ramen',
      description: 'Rich pork bone broth with fresh noodles and toppings',
      price: 1500,
      category: 'ramen',
      image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg',
      available: true,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Chicken Teriyaki',
      description: 'Grilled chicken with teriyaki sauce and steamed rice',
      price: 1200,
      category: 'main',
      image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
      available: true,
      rating: 4.5
    },
    {
      id: '3',
      name: 'Mochi Ice Cream',
      description: 'Traditional Japanese dessert with various flavors',
      price: 450,
      category: 'dessert',
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
      available: false,
      rating: 4.9
    },
    {
      id: '4',
      name: 'Sushi Platter',
      description: 'Fresh assorted sushi with wasabi and ginger',
      price: 2200,
      category: 'sushi',
      image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg',
      available: true,
      rating: 4.6
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'ramen', name: 'Ramen' },
    { id: 'sushi', name: 'Sushi' },
    { id: 'main', name: 'Main Courses' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'beverage', name: 'Beverages' }
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
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="border border-green-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
              <div className="relative h-48">
                <img
                  src={item.image}
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
                    <span className="text-sm text-gray-600">{item.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">₹{item.price}</span>
                  <div className="flex space-x-2">
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;