import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import NavBar from '../components/NavBar';
import { createReservation, checkAvailability } from '../services/tableReservationAPI';

export default function TableReservation() {
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTables, setAvailableTables] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    specialRequests: ''
  });

  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'
  ];

  const today = new Date().toISOString().split('T')[0];

  // Check availability when date or time slot changes
  const checkTableAvailability = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await checkAvailability(selectedDate, selectedTimeSlot);
      if (response.success) {
        setAvailableTables(response.availableTables);
        // Clear selected tables if they're no longer available
        setSelectedTables(prev => prev.filter(tableId => response.availableTables.includes(tableId)));
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking table availability. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedTimeSlot]);

  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      checkTableAvailability();
    }
  }, [selectedDate, selectedTimeSlot, checkTableAvailability]);

  const handleTableSelect = (tableId) => {
    if (!availableTables.includes(tableId)) return;
    
    setSelectedTables(prev => {
      if (prev.includes(tableId)) {
        return prev.filter(id => id !== tableId);
      } else {
        return [...prev, tableId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReserve = async () => {
    // Validation
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    if (!selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }
    if (selectedTables.length === 0) {
      alert('Please select at least one table');
      return;
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer information');
      return;
    }

    try {
      setLoading(true);
      
      const reservationData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        reservationDate: selectedDate,
        timeSlot: selectedTimeSlot,
        selectedTables: selectedTables,
        numberOfGuests: parseInt(customerInfo.guests) || 1,
        specialRequests: customerInfo.specialRequests
      };

      const response = await createReservation(reservationData);

      if (response.success) {
        const tableNumbers = selectedTables.sort((a, b) => a - b).join(', ');
        alert(`Reservation confirmed!\n\nReservation ID: ${response.reservation.reservationId}\nTables: ${tableNumbers}\nDate: ${selectedDate}\nTime: ${selectedTimeSlot}\n\nPlease save your reservation ID for future reference.`);
        
        // Reset form
        setSelectedTables([]);
        setSelectedDate('');
        setSelectedTimeSlot('');
        setCustomerInfo({
          name: '',
          email: '',
          phone: '',
          guests: 1,
          specialRequests: ''
        });
        setAvailableTables([1, 2, 3, 4, 5, 6, 7, 8]);
      } else {
        alert(`Reservation failed: ${response.message}`);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTableButtonClass = (tableNum) => {
    const isSelected = selectedTables.includes(tableNum);
    const isAvailable = availableTables.includes(tableNum);
    
    if (isSelected) {
      return 'bg-blue-500 border-blue-600 text-white shadow-lg transform scale-105';
    } else if (isAvailable) {
      return 'bg-green-500 border-green-600 text-white hover:bg-green-600 hover:shadow-md hover:transform hover:scale-105 active:bg-green-700';
    } else {
      return 'bg-red-500 border-red-600 text-white cursor-not-allowed opacity-80';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="relative h-32 flex items-center justify-center pt-24">
        <h1 className="text-gray-800 text-3xl font-bold tracking-wide drop-shadow-lg">
          Table Reservation
        </h1>
      </div>
      
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Customer Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  value={customerInfo.guests}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={customerInfo.specialRequests}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Any special requests or dietary requirements..."
                maxLength="500"
              />
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Select Date & Time
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Select Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Select Time Slot *
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Choose a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table Selection */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Select Tables {loading && <span className="text-sm text-gray-500">(Checking availability...)</span>}
            </h2>
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded border"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded border"></div>
                <span className="text-sm text-gray-600">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleTableSelect(1)}
                className={`
                  w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 border-2
                  ${getTableButtonClass(1)}
                `}
                disabled={!availableTables.includes(1) || loading}
              >
                Table 1
              </button>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((tableNum) => (
                  <button
                    key={tableNum}
                    onClick={() => handleTableSelect(tableNum)}
                    className={`
                      h-12 rounded-lg font-semibold text-sm transition-all duration-200 border-2
                      ${getTableButtonClass(tableNum)}
                    `}
                    disabled={!availableTables.includes(tableNum) || loading}
                  >
                    Table {tableNum}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[5, 6, 7].map((tableNum) => (
                  <button
                    key={tableNum}
                    onClick={() => handleTableSelect(tableNum)}
                    className={`
                      h-12 rounded-lg font-semibold text-sm transition-all duration-200 border-2
                      ${getTableButtonClass(tableNum)}
                    `}
                    disabled={!availableTables.includes(tableNum) || loading}
                  >
                    Table {tableNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleTableSelect(8)}
                className={`
                  w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 border-2
                  ${getTableButtonClass(8)}
                `}
                disabled={!availableTables.includes(8) || loading}
              >
                Table 8
              </button>
            </div>
          </div>

          {/* Reservation Summary */}
          {(selectedTables.length > 0 || selectedDate || selectedTimeSlot) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-2">Reservation Summary:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {customerInfo.name && <p>👤 Name: {customerInfo.name}</p>}
                {customerInfo.guests && <p>👥 Guests: {customerInfo.guests}</p>}
                {selectedTables.length > 0 && (
                  <p>📍 Selected Tables: {selectedTables.sort((a, b) => a - b).join(', ')}</p>
                )}
                {selectedDate && (
                  <p>📅 Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                )}
                {selectedTimeSlot && (
                  <p>⏰ Time: {selectedTimeSlot}</p>
                )}
              </div>
            </div>
          )}

          {/* Reserve Button */}
          <div className="flex justify-center">
            <button
              onClick={handleReserve}
              disabled={!selectedDate || !selectedTimeSlot || selectedTables.length === 0 || !customerInfo.name || !customerInfo.email || !customerInfo.phone || loading}
              className={`
                px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200
                ${(selectedDate && selectedTimeSlot && selectedTables.length > 0 && customerInfo.name && customerInfo.email && customerInfo.phone && !loading)
                  ? 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'Processing...' : 'Reserve Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}