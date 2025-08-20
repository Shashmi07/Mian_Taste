import React, { useState } from 'react';
import { Save, Clock, Bell, MapPin, Phone, Mail, Users } from 'lucide-react';

const Settings = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Mian Taste Restaurant',
    address: '123 Main Street, City, Country',
    phone: '+1 234 567 8900',
    email: 'info@miantaste.com',
    description: 'Authentic Asian cuisine with modern flavors'
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '11:00', close: '22:00', closed: false },
    tuesday: { open: '11:00', close: '22:00', closed: false },
    wednesday: { open: '11:00', close: '22:00', closed: false },
    thursday: { open: '11:00', close: '22:00', closed: false },
    friday: { open: '11:00', close: '23:00', closed: false },
    saturday: { open: '11:00', close: '23:00', closed: false },
    sunday: { open: '12:00', close: '21:00', closed: false }
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    customerReviews: false
  });

  const [tableSettings, setTableSettings] = useState({
    maxReservationDays: 30,
    reservationSlotDuration: 90,
    tablesCount: 25,
    maxPartySize: 8
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleRestaurantInfoChange = (field, value) => {
    setRestaurantInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTableSettingsChange = (field, value) => {
    setTableSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically send the data to your backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Restaurant Settings
          </h1>
          <p className="text-gray-600">Manage your restaurant configuration and preferences</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Information */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            Restaurant Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantInfo.name}
                onChange={(e) => handleRestaurantInfoChange('name', e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={restaurantInfo.address}
                onChange={(e) => handleRestaurantInfoChange('address', e.target.value)}
                className="form-input w-full h-20 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={restaurantInfo.phone}
                  onChange={(e) => handleRestaurantInfoChange('phone', e.target.value)}
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={restaurantInfo.email}
                  onChange={(e) => handleRestaurantInfoChange('email', e.target.value)}
                  className="form-input w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={restaurantInfo.description}
                onChange={(e) => handleRestaurantInfoChange('description', e.target.value)}
                className="form-input w-full h-24 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-green-600" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Table Management Settings */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Table Management
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Reservation Days
                </label>
                <input
                  type="number"
                  value={tableSettings.maxReservationDays}
                  onChange={(e) => handleTableSettingsChange('maxReservationDays', parseInt(e.target.value))}
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Duration (minutes)
                </label>
                <input
                  type="number"
                  value={tableSettings.reservationSlotDuration}
                  onChange={(e) => handleTableSettingsChange('reservationSlotDuration', parseInt(e.target.value))}
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Tables
                </label>
                <input
                  type="number"
                  value={tableSettings.tablesCount}
                  onChange={(e) => handleTableSettingsChange('tablesCount', parseInt(e.target.value))}
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Party Size
                </label>
                <input
                  type="number"
                  value={tableSettings.maxPartySize}
                  onChange={(e) => handleTableSettingsChange('maxPartySize', parseInt(e.target.value))}
                  className="form-input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Operating Hours
          </h3>
          <div className="space-y-3">
            {days.map(day => (
              <div key={day} className="flex items-center justify-between">
                <div className="w-24">
                  <span className="text-gray-700 font-medium capitalize">{day}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={operatingHours[day].closed}
                      onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)}
                      className="mr-1"
                    />
                    <span className="text-sm text-gray-600">Closed</span>
                  </label>
                  {!operatingHours[day].closed && (
                    <>
                      <input
                        type="time"
                        value={operatingHours[day].open}
                        onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                        className="form-input w-24 text-sm"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={operatingHours[day].close}
                        onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                        className="form-input w-24 text-sm"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
