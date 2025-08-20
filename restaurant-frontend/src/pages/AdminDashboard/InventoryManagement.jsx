import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Plus, Edit2, Package } from 'lucide-react';

const InventoryManagement = () => {
  const [inventoryItems] = useState([
    {
      id: '1',
      name: 'Basmati Rice',
      category: 'Grains',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      unit: 'kg',
      lastUpdated: '2 hours ago',
      status: 'low'
    },
    {
      id: '2',
      name: 'Chicken Breast',
      category: 'Meat',
      currentStock: 45,
      minStock: 30,
      maxStock: 80,
      unit: 'kg',
      lastUpdated: '4 hours ago',
      status: 'normal'
    },
    {
      id: '3',
      name: 'Soy Sauce',
      category: 'Condiments',
      currentStock: 75,
      minStock: 25,
      maxStock: 100,
      unit: 'bottles',
      lastUpdated: '1 day ago',
      status: 'high'
    },
    {
      id: '4',
      name: 'Sesame Oil',
      category: 'Oils',
      currentStock: 8,
      minStock: 10,
      maxStock: 30,
      unit: 'liters',
      lastUpdated: '6 hours ago',
      status: 'low'
    }
  ]);

  const lowStockItems = inventoryItems.filter(item => item.status === 'low');
  const totalItems = inventoryItems.length;
  const lowStockPercentage = (lowStockItems.length / totalItems) * 100;

  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-gradient-to-r from-red-50 to-red-100';
      case 'high': return 'text-green-600 bg-gradient-to-r from-green-50 to-green-100';
      default: return 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100';
    }
  };

  const getStockIcon = (status) => {
    switch (status) {
      case 'low': return <TrendingDown className="w-4 h-4" />;
      case 'high': return <TrendingUp className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-gray-600">Track and manage your restaurant inventory</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

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
            <h3 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h3>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{lowStockItems.length}</div>
          <p className="text-gray-600">items need restocking</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Stock Health</h3>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {(100 - lowStockPercentage).toFixed(0)}%
          </div>
          <p className="text-gray-600">items adequately stocked</p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <div className="mt-2">
                  <span className="text-red-600 font-bold">{item.currentStock} {item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="data-table">
        <div className="p-6 border-b border-green-100">
          <h3 className="text-lg font-semibold text-gray-800">Inventory Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map(item => (
                <tr key={item.id}>
                  <td className="font-medium text-gray-800">{item.name}</td>
                  <td className="text-gray-600">{item.category}</td>
                  <td>
                    <span className="font-semibold text-gray-800">{item.currentStock} {item.unit}</span>
                  </td>
                  <td className="text-gray-600">
                    {item.minStock} / {item.maxStock} {item.unit}
                  </td>
                  <td>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStockIcon(item.status)}
                      <span className="capitalize">{item.status}</span>
                    </div>
                  </td>
                  <td className="text-gray-500">{item.lastUpdated}</td>
                  <td>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;