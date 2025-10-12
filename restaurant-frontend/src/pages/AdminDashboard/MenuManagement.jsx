 import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Star } from 'lucide-react';

// Image imports for menu items from MenuItems folder
import chickenRamen from '../../assets/MenuItems/chickenRamen.jpg';
import eggRamen from '../../assets/MenuItems/eggRamen.jpg';
import porkRamen from '../../assets/MenuItems/porkRamen.jpg';
import beefRamen from '../../assets/MenuItems/beefRamen.jpg';
import seafoodRamen from '../../assets/MenuItems/SeafoodRamen.jpg';
import veganRamen from '../../assets/MenuItems/veganRamen.jpeg';
import blackRamen from '../../assets/MenuItems/blackRamen.jpg';
import cheeseRamen from '../../assets/MenuItems/cheeseRamen.png';
import beefandPorkRamen from '../../assets/MenuItems/beefandPorkRamen.jpg';
import buldakChicken from '../../assets/MenuItems/buldakChicken.jpg';
import buldakBeef from '../../assets/MenuItems/buldakBeef.jpg';
import buldakPork from '../../assets/MenuItems/buldakPork.jpg';
import buldakBeefPork from '../../assets/MenuItems/buldakBeefPork.jpg';
import beefPorkBuldak from '../../assets/MenuItems/beefPorkBuldak.jpg';
import cheeseChicken from '../../assets/MenuItems/cheeseChicken.jpg';
import cheesePork from '../../assets/MenuItems/cheesePork.jpg';
import beefPork from '../../assets/MenuItems/beefPork.jpg';
import beefCheese from '../../assets/MenuItems/beefCheese.jpg';
import eggRice from '../../assets/MenuItems/eggRice.png';
import beefRice from '../../assets/MenuItems/beefRice.jpg';
import porkRice from '../../assets/MenuItems/porkRice.jpg';
import vegetableRice from '../../assets/MenuItems/vegetableRice.jpg';
import beefPorkRice from '../../assets/MenuItems/beefPorkRice.jpg';
import chickenSoup from '../../assets/MenuItems/chickenSoup.jpg';
import beefSoup from '../../assets/MenuItems/beefSoup.jpg';
import porkSoup from '../../assets/MenuItems/porkSoup.jpg';
import eggSoup from '../../assets/MenuItems/eggSoup.jpg';
import beefPorkSoup from '../../assets/MenuItems/beefPorkSoup.jpg';
import cocacola from '../../assets/MenuItems/cocacola.jpg';
import sprite from '../../assets/MenuItems/sprite.jpeg';
import orangeJuice from '../../assets/MenuItems/orangeJuice.jpg';
import gingerBeer from '../../assets/MenuItems/gingerBeer.png';
import cheeseRamenChicken from '../../assets/MenuItems/cheeseramenchicken.jpg';
import hotEggSpicy from '../../assets/MenuItems/hoteggspicy.jpg';
import sutahRamenVeg from '../../assets/MenuItems/sutahramenveg.jpg';
import wooden from '../../assets/MenuItems/wooden.jpg';
import bamboo from '../../assets/MenuItems/bamboo.jpg';
import watermelon from '../../assets/MenuItems/watermelon.jpg';
// Keep default ramen from main assets as fallback
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
  'gingerBeer.png': gingerBeer,
  'cheeseramenchicken.jpg': cheeseRamenChicken,
  'hoteggspicy.jpg': hotEggSpicy,
  'sutahramenveg.jpg': sutahRamenVeg,
  'wooden.jpg': wooden,
  'bamboo.jpg': bamboo,
  'watermelon.jpg': watermelon
};

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState({});

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Ramen',
    image: '',
    rating: 4.5,
    available: true
  });

  // Image upload state
  const [imagePreview, setImagePreview] = useState(null);

  // Available image options from assets
  const availableImages = Object.keys(imageMap);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching menu items...');

      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`${API_URL}/menu?${params}`);
      
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
  }, [selectedCategory, API_URL]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/menu/${id}`, {
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

  // Add new menu item
  const handleAddItem = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setShowAddModal(false);
        resetForm();
        await fetchMenuItems(); // Refresh the list
        console.log('Item added successfully:', result);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit existing menu item
  const handleEditItem = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch(`${API_URL}/menu/${selectedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditModal(false);
        resetForm();
        await fetchMenuItems(); // Refresh the list
        console.log('Item updated successfully');
      } else {
        if (response.status === 404) {
          setError('Item not found. The list will be refreshed.');
          await fetchMenuItems(); // Refresh the list if item not found
          setTimeout(() => {
            setShowEditModal(false);
            resetForm();
          }, 1000);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to update item');
        }
      }
    } catch (error) {
      console.error('Error editing item:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete menu item
  const handleDeleteItem = async () => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`${API_URL}/menu/${selectedItem._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMenuItems(items => items.filter(item => item._id !== selectedItem._id));
        setShowDeleteModal(false);
        setSelectedItem(null);
        console.log('Item deleted successfully');
      } else {
        if (response.status === 404) {
          console.log('Item not found, refreshing list...');
          await fetchMenuItems(); // Refresh the list if item not found
          setShowDeleteModal(false);
          setSelectedItem(null);
        } else {
          const errorData = await response.json();
          console.error('Failed to delete item:', errorData);
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Ramen',
      image: '',
      rating: 4.5,
      available: true
    });
    setImagePreview(null);
    setError('');
  };

  // Handle selecting from existing images
  const handleExistingImageSelect = (imageName) => {
    setFormData({...formData, image: imageName});
    setImagePreview(imageMap[imageName]);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      rating: item.rating,
      available: item.available
    });
    // Set image preview for existing image
    setImagePreview(imageMap[item.image] || null);
    setError('');
    setShowEditModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
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
        <button onClick={openAddModal} className="btn-primary flex items-center space-x-2">
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
                      <button onClick={() => openEditModal(item)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => openDeleteModal(item)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Menu Item</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Item name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Item description"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="RS.1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Ramen">Ramen</option>
                  <option value="Rice">Rice</option>
                  <option value="Soup">Soup</option>
                  <option value="Drinks">Drinks</option>
                  <option value="More">More</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <select
                  value={formData.image}
                  onChange={(e) => handleExistingImageSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select an image...</option>
                  {availableImages.map((imageName) => (
                    <option key={imageName} value={imageName}>
                      {imageName}
                    </option>
                  ))}
                </select>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 mb-1">Preview</label>
                    <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Available</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={submitting}
                className={`px-4 py-2 text-white rounded-lg ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {submitting ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Menu Item</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Ramen">Ramen</option>
                  <option value="Rice">Rice</option>
                  <option value="Soup">Soup</option>
                  <option value="Drinks">Drinks</option>
                  <option value="More">More</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <select
                  value={formData.image}
                  onChange={(e) => handleExistingImageSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select an image...</option>
                  {availableImages.map((imageName) => (
                    <option key={imageName} value={imageName}>
                      {imageName}
                    </option>
                  ))}
                </select>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 mb-1">Preview</label>
                    <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Available</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditItem}
                disabled={submitting}
                className={`px-4 py-2 text-white rounded-lg ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Updating...' : 'Update Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">Delete Menu Item</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{selectedItem.name}</strong>"? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={submitting}
                className={`px-4 py-2 text-white rounded-lg ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {submitting ? 'Deleting...' : 'Delete Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;