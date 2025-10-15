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

// Helper functions for calculations
const calculateProjectedRevenue = (dailySales) => {
  if (!dailySales || dailySales.length < 7) return 0;
  const lastWeek = dailySales.slice(-7);
  const average = lastWeek.reduce((sum, day) => sum + (day.totalRevenue || 0), 0) / 7;
  // Apply a simple growth factor based on trend
  const growthFactor = 1.1; // 10% projected growth
  return average * 7 * growthFactor;
};

const calculateRecommendedStaff = (hourlyData, peakHour) => {
  if (!hourlyData || !hourlyData[peakHour]) return '';
  
  const peakOrders = hourlyData[peakHour].orderCount;
  // Assuming one staff member can handle 5 orders per hour
  const baseStaff = Math.ceil(peakOrders / 5);
  const buffer = Math.ceil(baseStaff * 0.2); // 20% buffer
  
  return ` ${baseStaff + buffer} staff members recommended`;
};

const getTopSellingPredictions = (items) => {
  if (!items || !items.length) return [];
  
  return items
    .slice(0, 3)
    .map(item => ({
      itemName: item.itemName,
      projectedDemand: Math.ceil(item.totalQuantity * 1.2) // 20% increase projection
    }));
};

const getPeakPeriodPredictions = (hourlyData) => {
  if (!hourlyData) return [];
  
  const busyHours = hourlyData
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 3)
    .map(hour => ({
      time: `${hour.hour}:00 - ${(hour.hour + 1) % 24}:00`,
      prediction: `${hour.orderCount} orders expected`
    }));

  return busyHours;
};

const generateActionItems = (data) => {
  if (!data) return [];
  
  const actions = [];
  
  // Revenue-based actions
  if (data.dailySales && data.dailySales.length > 0) {
    const recentRevenue = data.dailySales[data.dailySales.length - 1].totalRevenue;
    const averageRevenue = data.dailySales.reduce((sum, day) => sum + day.totalRevenue, 0) / data.dailySales.length;
    
    if (recentRevenue < averageRevenue) {
      actions.push('Consider running promotional campaigns');
    }
  }

  // Peak hour actions
  if (data.hourlyAnalysis) {
    const peakHours = data.hourlyAnalysis.filter(hour => hour.orderCount > 10);
    if (peakHours.length > 0) {
      actions.push('Schedule additional staff for peak hours');
    }
  }

  // Inventory actions
  if (data.foodItems && data.foodItems.length > 0) {
    actions.push('Review inventory levels for top-selling items');
  }

  return actions;
};

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    preset: 'last30days'
  });
  const [showCustomRange, setShowCustomRange] = useState(false);
  
  // Additional metrics calculations
  const [forecastData, setForecastData] = useState(null);
  const [menuAnalytics, setMenuAnalytics] = useState(null);
  const [operationalMetrics, setOperationalMetrics] = useState(null);
  const [customerMetrics, setCustomerMetrics] = useState(null);

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
      
      // Check if token exists
      if (!token) {
        console.error('No auth token found');
        throw new Error('Authentication token is missing');
      }

      console.log('Fetching analytics with token:', token.substring(0, 10) + '...');
      
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      const daysDiff = Math.ceil((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24));

      console.log('Fetching analytics for date range:', { startDate, endDate, daysDiff });
      
      let response = await fetch(`${API_URL}/admin-analytics/data?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      let responseText;
      try {
        responseText = await response.text();
        console.log('Raw API Response:', responseText);
      } catch (e) {
        console.error('Error reading response:', e);
      }

      if (!response.ok) {
        console.log('New API format failed, trying legacy format...');
        response = await fetch(`${API_URL}/admin-analytics/data?days=${daysDiff}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        responseText = await response.text();
        console.log('Raw Legacy API Response:', responseText);
      }

      if (response.ok) {
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Parsed analytics data:', data);
          setAnalyticsData(data.data || data);
          setLoading(false);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          throw e;
        }
      } else {
        console.error('API Error:', response.status, responseText);
        setAnalyticsData({
          dailySales: [],
          ordersSummary: [],
          hourlyAnalysis: Array.from({length: 24}, (_, i) => ({ hour: i, orderCount: 0, revenue: 0 })),
          foodItems: []
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Set default data in case of error
      setAnalyticsData({
        dailySales: [],
        ordersSummary: [],
        hourlyAnalysis: Array.from({length: 24}, (_, i) => ({ hour: i, orderCount: 0, revenue: 0 })),
        foodItems: []
      });
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

        {/* Business Insights Section */}
        <div className="bg-white rounded-lg border border-green-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Business Insights</h3>
              <p className="text-gray-600 text-sm">Data-driven recommendations for your restaurant</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Revenue Trends */}
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Revenue Analysis</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {revenueChangePercent >= 0 ? (
                      `Revenue is up ${Math.abs(Math.round(revenueChangePercent))}% from last period. Keep up the momentum!`
                    ) : (
                      `Revenue is down ${Math.abs(Math.round(revenueChangePercent))}%. Consider: 
                      1. Happy hour promotions
                      2. Limited-time menu items
                      3. Social media marketing`
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Operational Insights */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Peak Hours Management</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {`Busiest time: ${getHourLabel(peakHour)}
                    ${hourlyData[peakHour]?.orderCount > (averageHourlyOrders * 1.5) ? 
                      '• Schedule extra staff during peak\n• Prepare ingredients in advance\n• Consider express menu options' :
                      '• Current staffing levels appear adequate\n• Monitor customer wait times'}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Performance */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChefHat className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Menu Optimization</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {topItems.length > 0 ? (
                      `Top performer: ${topItems[0]?.itemName}
                      • Create combo meals with this item
                      • Consider similar menu variations
                      • Feature in promotional materials`
                    ) : (
                      'Insufficient data to analyze menu performance'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Behavior */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Customer Insights</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Average order: {formatLKR(metrics.averageOrder)}
                    {metrics.averageOrder > 0 ? `
                    • ${metrics.uniqueCustomers} unique customers
                    • Consider loyalty program
                    • Implement targeted promotions` : ''}
                  </p>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="bg-white rounded-lg border border-green-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
                <p className="text-gray-600 text-sm">Comprehensive business performance insights</p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="p-6">
            {/* Revenue Analysis */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Revenue Trends
              </h4>
              <div className="h-[300px] bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData?.dailySales || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                      stroke="#6b7280"
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value) => formatLKR(value)}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.5rem' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalRevenue" 
                      stroke="#059669" 
                      strokeWidth={2}
                      dot={{ fill: '#059669' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Projected Revenue (Next Week)</p>
                  <p className="text-xl font-bold text-green-700 mt-1">
                    {formatLKR(calculateProjectedRevenue(analyticsData?.dailySales))}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Average Daily Revenue</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">
                    {formatLKR(metrics.totalRevenue / (analyticsData?.dailySales?.length || 1))}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                  <p className="text-xl font-bold text-purple-700 mt-1">
                    {revenueChangePercent > 0 ? '+' : ''}{Math.round(revenueChangePercent)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Order Distribution Analysis */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-orange-600" />
                Order Distribution
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Order Type Distribution</h5>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData?.dailySales?.map(day => ({
                        ...day,
                        tableReservationOrders: day.reservationOrders || 0  // Map reservation orders to table reservations
                      })) || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                          stroke="#6b7280"
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.5rem' }}
                        />
                        <Bar dataKey="qrOrders" name="QR Orders" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="preOrders" name="Pre-Orders" stackId="a" fill="#8b5cf6" />
                        <Bar dataKey="tableReservationOrders" name="Table Reservations" stackId="a" fill="#ec4899" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Insights */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Smart Business Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <h5 className="font-medium text-gray-900 mb-2">Peak Hours Analysis</h5>
                  <p className="text-sm text-gray-600">
                    Busiest time: {getHourLabel(peakHour)} <br />
                    Average orders: {Math.round(averageHourlyOrders)} per hour <br />
                    Peak volume: {analyticsData?.hourlyAnalysis[peakHour]?.orderCount || 0} orders
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                  <h5 className="font-medium text-gray-900 mb-2">Customer Analysis</h5>
                  <p className="text-sm text-gray-600">
                    Total customers today: {metrics.uniqueCustomers} <br />
                    Average order value: {formatLKR(metrics.averageOrder)} <br />
                    Revenue growth: {revenueChangePercent > 0 ? '+' : ''}{Math.round(revenueChangePercent)}%
                  </p>
                </div>
              </div>
            </div>
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