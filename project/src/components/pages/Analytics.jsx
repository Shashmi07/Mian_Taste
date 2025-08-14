import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, ShoppingCart, Calendar, Download } from 'lucide-react';
import Chart from '../ui/Chart';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const periods = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'year', name: 'This Year' }
  ];

  const metrics = [
    { id: 'revenue', name: 'Revenue', icon: DollarSign, value: '₹45,231', change: '+12.5%', positive: true },
    { id: 'orders', name: 'Total Orders', icon: ShoppingCart, value: '1,234', change: '+8.3%', positive: true },
    { id: 'customers', name: 'New Customers', icon: Users, value: '456', change: '-2.1%', positive: false },
    { id: 'avg-order', name: 'Avg Order Value', icon: TrendingUp, value: '₹1,865', change: '+5.2%', positive: true }
  ];

  const topMenuItems = [
    { name: 'Tonkotsu Ramen', orders: 142, revenue: '₹2,13,000' },
    { name: 'Chicken Teriyaki', orders: 128, revenue: '₹1,53,600' },
    { name: 'Sushi Platter', orders: 95, revenue: '₹2,09,000' },
    { name: 'Miso Soup', orders: 89, revenue: '₹31,150' },
    { name: 'Mochi Ice Cream', orders: 76, revenue: '₹34,200' }
  ];

  const ordersByHour = [
    { hour: '6 AM', orders: 5 },
    { hour: '7 AM', orders: 12 },
    { hour: '8 AM', orders: 18 },
    { hour: '9 AM', orders: 25 },
    { hour: '10 AM', orders: 32 },
    { hour: '11 AM', orders: 45 },
    { hour: '12 PM', orders: 68 },
    { hour: '1 PM', orders: 72 },
    { hour: '2 PM', orders: 58 },
    { hour: '3 PM', orders: 42 },
    { hour: '4 PM', orders: 35 },
    { hour: '5 PM', orders: 48 },
    { hour: '6 PM', orders: 85 },
    { hour: '7 PM', orders: 92 },
    { hour: '8 PM', orders: 78 },
    { hour: '9 PM', orders: 65 },
    { hour: '10 PM', orders: 42 },
    { hour: '11 PM', orders: 18 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p className="text-gray-600">Track your restaurant's performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-select"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                <Icon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</div>
              <div className={`flex items-center text-sm ${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  metric.positive ? '' : 'rotate-180'
                }`} />
                <span>{metric.change} from last {selectedPeriod}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <div className="flex justify-between items-center mb-6">
            <h3 className="chart-title">Revenue Trend</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="form-select w-auto"
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <Chart />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Orders by Hour</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {ordersByHour.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-16">{item.hour}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-green-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.orders / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-12 text-right">
                  {item.orders}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="chart-title">Top Menu Items</h3>
          <div className="space-y-4">
            {topMenuItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{item.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-white">
              <div>
                <h4 className="font-medium text-gray-800">Average Order Value</h4>
                <p className="text-sm text-gray-500">Per customer transaction</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">₹1,865</p>
                <p className="text-sm text-green-600">+5.2%</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-white">
              <div>
                <h4 className="font-medium text-gray-800">Customer Retention</h4>
                <p className="text-sm text-gray-500">Returning customers</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">68%</p>
                <p className="text-sm text-green-600">+3.1%</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-white">
              <div>
                <h4 className="font-medium text-gray-800">Peak Hours</h4>
                <p className="text-sm text-gray-500">Busiest time</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">7-8 PM</p>
                <p className="text-sm text-gray-600">92 orders</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-white">
              <div>
                <h4 className="font-medium text-gray-800">Monthly Growth</h4>
                <p className="text-sm text-gray-500">Revenue increase</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">+12.5%</p>
                <p className="text-sm text-green-600">vs last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;