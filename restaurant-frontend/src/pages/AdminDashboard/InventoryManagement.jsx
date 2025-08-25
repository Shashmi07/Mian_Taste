import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Package, RefreshCw, Eye, XCircle } from 'lucide-react';

const InventoryManagement = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch inventory data from backend
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/admin-inventory`);
      const data = await response.json();
      
      if (data.success) {
        setInventoryData(data.data);
      } else {
        setError(data.message || 'Failed to fetch inventory data');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Helper functions
  const formatQuantity = (quantity, unit) => {
    if (unit === 'g' && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)} kg`;
    }
    if (unit === 'ml' && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)} L`;
    }
    return `${quantity} ${unit}`;
  };

  const formatLastUpdated = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };


  // Get data safely
  const inventory = inventoryData?.inventory || [];
  const insights = inventoryData?.insights || {};
  const lowStockItems = insights.lowStockItems || [];
  const outOfStockItems = insights.outOfStockItems || [];
  const totalItems = insights.totalItems || 0;
  const stockHealth = totalItems > 0 ? Math.round(((totalItems - lowStockItems.length - outOfStockItems.length) / totalItems) * 100) : 100;

  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-gradient-to-r from-red-50 to-red-100';
      case 'out of stock': return 'text-red-800 bg-gradient-to-r from-red-100 to-red-200';
      case 'available': return 'text-green-600 bg-gradient-to-r from-green-50 to-green-100';
      default: return 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100';
    }
  };

  const getStockIcon = (status) => {
    switch (status) {
      case 'low': return <TrendingDown className="w-4 h-4" />;
      case 'out of stock': return <XCircle className="w-4 h-4" />;
      case 'available': return <TrendingUp className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Inventory Overview
          </h1>
          <p className="text-gray-600">View restaurant inventory managed by chef</p>
        </div>
        <button 
          onClick={fetchInventoryData}
          disabled={loading}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Items</h3>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{totalItems}</div>
          <p className="text-gray-600">inventory items tracked</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Stock Alerts</h3>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {loading ? '...' : (lowStockItems.length + outOfStockItems.length)}
          </div>
          <p className="text-gray-600">items need attention</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Stock Health</h3>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {loading ? '...' : `${stockHealth}%`}
          </div>
          <p className="text-gray-600">items adequately stocked</p>
        </div>
      </div>

      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && !loading && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Inventory Alerts</h3>
          </div>
          
          {outOfStockItems.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-red-700 mb-3">Out of Stock Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outOfStockItems.map(item => (
                  <div key={item._id} className="bg-red-100 rounded-lg p-4 border border-red-300">
                    <h5 className="font-semibold text-gray-800">{item.name}</h5>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-red-700 font-bold">OUT OF STOCK</span>
                      <span className="text-sm text-gray-600">Min: {formatQuantity(item.minStock, item.unit)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {lowStockItems.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-red-600 mb-3">Low Stock Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockItems.map(item => (
                  <div key={item._id} className="bg-white rounded-lg p-4 border border-red-200">
                    <h5 className="font-semibold text-gray-800">{item.name}</h5>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-red-600 font-bold">{formatQuantity(item.quantity, item.unit)}</span>
                      <span className="text-sm text-gray-600">Min: {formatQuantity(item.minStock, item.unit)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="data-table">
        <div className="p-6 border-b border-green-100">
          <h3 className="text-lg font-semibold text-gray-800">All Inventory Items</h3>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading inventory...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No inventory items found</p>
            <p className="text-gray-400">Inventory is managed by the chef</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item._id}>
                    <td className="font-medium text-gray-800">{item.name}</td>
                    <td>
                      <span className="font-semibold text-gray-800">
                        {formatQuantity(item.quantity, item.unit)}
                      </span>
                    </td>
                    <td>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {getStockIcon(item.status)}
                        <span className="capitalize">{item.status === 'out of stock' ? 'Out of Stock' : item.status}</span>
                      </div>
                    </td>
                    <td className="text-gray-500">{formatLastUpdated(item.lastUpdated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default InventoryManagement;