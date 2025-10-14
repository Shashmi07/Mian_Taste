import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  RefreshCw,
  ChefHat,
  Brain,
  Lightbulb
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import io from 'socket.io-client';

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    preset: 'last30days'
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Memoized calculations
  const metrics = useMemo(() => {
    const totalRevenue = analyticsData?.dailySales?.reduce((sum, day) => sum + day.totalRevenue, 0) || 0;
    const totalOrders = analyticsData?.ordersSummary?.length || 0;
    const uniqueCustomers = analyticsData?.ordersSummary ? 
      new Set(analyticsData.ordersSummary.map(o => o.customerName || o.customerEmail).filter(Boolean)).size : 0;
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      averageOrder
    };
  }, [analyticsData]);

  const averageHourlyOrders = useMemo(() => {
    if (!analyticsData?.hourlyAnalysis) return 0;
    const total = analyticsData.hourlyAnalysis.reduce((sum, hour) => sum + hour.orderCount, 0);
    return total / analyticsData.hourlyAnalysis.length;
  }, [analyticsData?.hourlyAnalysis]);

  const revenueChangePercent = useMemo(() => {
    if (!analyticsData?.lastPeriodRevenue || !metrics.totalRevenue) return 0;
    return ((metrics.totalRevenue - analyticsData.lastPeriodRevenue) / analyticsData.lastPeriodRevenue) * 100;
  }, [analyticsData?.lastPeriodRevenue, metrics.totalRevenue]);

  // Get peak hour
  const hourlyData = analyticsData?.hourlyAnalysis || [];
  const peakHour = hourlyData.reduce((acc, curr, index) => 
    curr.orderCount > (hourlyData[acc]?.orderCount || 0) ? index : acc, 0);

  // Top items
  const topItems = analyticsData?.foodItems
    ?.sort((a, b) => b.totalQuantity - a.totalQuantity)
    ?.slice(0, 5) || [];

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      const daysDiff = Math.ceil((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24));

      let response = await fetch(`${API_URL}/admin-analytics/data?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.log('New API format failed, trying legacy format...');
        response = await fetch(`${API_URL}/admin-analytics/data?days=${daysDiff}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data || data);
      } else {
        console.error('API Error:', response.status, await response.text());
        setAnalyticsData({
          dailySales: [],
          ordersSummary: [],
          hourlyAnalysis: Array.from({length: 24}, (_, i) => ({ hour: i, orderCount: 0, revenue: 0 })),
          foodItems: []
        });
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, dateRange]);

  // Real-time socket connection
  useEffect(() => {
    const socket = io(API_URL);
    
    socket.on('connect', () => {
      console.log('Connected to analytics socket');
    });

    socket.on('orderUpdate', () => {
      console.log('Received order update');
      fetchAnalyticsData();
    });

    socket.on('inventoryUpdate', () => {
      console.log('Received inventory update');
      fetchAnalyticsData();
    });

    return () => {
      socket.disconnect();
    };
  }, [API_URL, fetchAnalyticsData]);

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  // Format helpers
  const formatLKR = (amount) => `Rs ${Math.round(amount).toLocaleString()}/=`;
  
  const getHourLabel = (hour) => {
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${period}`;
  };

  // Date range helpers
  const setPresetRange = (preset) => {
    const today = new Date();
    let startDate, endDate;
    
    switch(preset) {
      case 'today':
        startDate = endDate = new Date(today);
        break;
      case 'yesterday':
        startDate = endDate = new Date(today.setDate(today.getDate() - 1));
        break;
      case 'last7days':
        endDate = new Date(today);
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'last30days':
        endDate = new Date(today);
        startDate = new Date(today.setDate(today.getDate() - 30));
        break;
      default:
        return;
    }
    
    setDateRange({ startDate, endDate, preset });
    setShowCustomRange(false);
  };

  const handleCustomDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: new Date(value),
      preset: 'custom'
    }));
  };

  const formatDateRange = () => {
    const presetLabels = {
      'today': 'Today',
      'yesterday': 'Yesterday',
      'last7days': 'Last 7 Days',
      'last30days': 'Last 30 Days'
    };
    
    if (dateRange.preset && presetLabels[dateRange.preset]) {
      return presetLabels[dateRange.preset];
    }
    
    const start = dateRange.startDate.toLocaleDateString();
    const end = dateRange.endDate.toLocaleDateString();
    return start === end ? start : `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
        <p className="text-gray-500 text-lg mt-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-[#46923c] to-[#5BC142] rounded-xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">Real-time restaurant performance insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Date Range Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCustomRange(!showCustomRange)}
                  className="flex items-center justify-between w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  <span className="text-sm text-gray-700">{formatDateRange()}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCustomRange ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showCustomRange && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Select</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'today', label: 'Today' },
                          { key: 'yesterday', label: 'Yesterday' },
                          { key: 'last7days', label: 'Last 7 Days' },
                          { key: 'last30days', label: 'Last 30 Days' }
                        ].map(preset => (
                          <button
                            key={preset.key}
                            onClick={() => setPresetRange(preset.key)}
                            className={`px-3 py-2 text-sm rounded text-left ${
                              dateRange.preset === preset.key
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            } transition-colors`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Range</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={dateRange.startDate.toISOString().split('T')[0]}
                            onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={dateRange.endDate.toISOString().split('T')[0]}
                            onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-[#46923c] to-[#5BC142] rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">{formatLKR(metrics.totalRevenue)}</p>
                <p className="text-green-100 text-xs mt-1">
                  {revenueChangePercent > 0 ? '↗' : '↘'} {Math.abs(Math.round(revenueChangePercent))}% vs last period
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.totalOrders}</p>
                <p className="text-blue-600 text-xs mt-1 font-medium">🔥 Peak: {getHourLabel(peakHour)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Unique Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.uniqueCustomers}</p>
                <p className="text-purple-600 text-xs mt-1 font-medium">👥 Active today</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Average Order Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Order</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatLKR(metrics.averageOrder)}</p>
                <p className="text-orange-600 text-xs mt-1 font-medium">📈 Per customer</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-lg p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData?.dailySales || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatLKR(value)}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalRevenue" 
                    stroke="#46923c" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Distribution Chart */}
          <div className="bg-white rounded-lg p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Order Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.hourlyAnalysis || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => value}
                    labelFormatter={(hour) => `${hour}:00 - ${(hour + 1) % 24}:00`}
                  />
                  <Bar 
                    dataKey="orderCount" 
                    fill="#5BC142"
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white rounded-lg border border-green-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
              <p className="text-gray-600 text-sm">Smart recommendations based on your data</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Revenue Insight */}
            {revenueChangePercent < 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Revenue Alert</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Revenue is down {Math.abs(Math.round(revenueChangePercent))}% compared to last period.
                      Consider running promotions during off-peak hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Peak Hour Staffing */}
            {hourlyData[peakHour]?.orderCount > (averageHourlyOrders * 1.5) && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Staffing Suggestion</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Order volume is 50% higher during peak hours ({getHourLabel(peakHour)}).
                      Consider additional staff during these hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Optimization */}
            {topItems.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Menu Insight</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {topItems[0]?.itemName} is your best seller. Consider creating
                      combo meals featuring this item to increase average order value.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Menu Items */}
        <div className="bg-white rounded-lg border border-green-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
                <p className="text-gray-600 text-sm">Best performing menu items this period</p>
              </div>
              <ChefHat className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="p-6">
            {topItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No sales data available</p>
            ) : (
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.itemName}</p>
                        <p className="text-sm text-gray-500">Revenue: {formatLKR(item.totalRevenue)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.totalQuantity}</p>
                      <p className="text-sm text-gray-500">orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;