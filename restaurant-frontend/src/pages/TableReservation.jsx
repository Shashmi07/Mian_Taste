
import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function TableReservation() {
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const tables = [
    { id: 1, number: 1, available: true },
    { id: 2, number: 2, available: true },
    { id: 3, number: 3, available: true },
    { id: 4, number: 4, available: true },
    { id: 5, number: 5, available: true },
    { id: 6, number: 6, available: true },
    { id: 7, number: 7, available: true },
    { id: 8, number: 8, available: false } // Example of unavailable table
  ];

  // Generate time slots from 9 AM to 9 PM (1-hour slots)
  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'
  ];

  // Get today's date for minimum date selection
  const today = new Date().toISOString().split('T')[0];

  const handleTableSelect = (tableId, available) => {
    if (!available) return;
    
    setSelectedTables(prev => {
      if (prev.includes(tableId)) {
        // Remove table if already selected
        return prev.filter(id => id !== tableId);
      } else {
        // Add table to selection
        return [...prev, tableId];
      }
    });
  };

  const handleReserve = () => {
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

    const tableNumbers = selectedTables.sort((a, b) => a - b).join(', ');
    alert(`Tables ${tableNumbers} reserved successfully for ${selectedDate} at ${selectedTimeSlot}!`);
    console.log(`Reserving tables: ${selectedTables}, Date: ${selectedDate}, Time: ${selectedTimeSlot}`);
  };

  const getTableButtonClass = (tableNum, available) => {
    const isSelected = selectedTables.includes(tableNum);
    
    if (isSelected) {
      return 'bg-blue-500 border-blue-600 text-white shadow-lg transform scale-105';
    } else if (available) {
      return 'bg-green-500 border-green-600 text-white hover:bg-green-600 hover:shadow-md hover:transform hover:scale-105 active:bg-green-700';
    } else {
      return 'bg-red-500 border-red-600 text-white cursor-not-allowed opacity-80';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative">
        {/* Restaurant Background Image */}
        <div className="relative h-48 bg-gradient-to-br from-amber-600 to-orange-700 overflow-hidden">
          {/* Restaurant Interior Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                  <!-- Restaurant interior simulation -->
                  <rect width="400" height="200" fill="#8B4513"/>
                  
                  <!-- Tables -->
                  <rect x="50" y="120" width="40" height="30" rx="4" fill="#D2691E" opacity="0.8"/>
                  <rect x="120" y="120" width="40" height="30" rx="4" fill="#D2691E" opacity="0.8"/>
                  <rect x="190" y="120" width="40" height="30" rx="4" fill="#D2691E" opacity="0.8"/>
                  <rect x="260" y="120" width="40" height="30" rx="4" fill="#D2691E" opacity="0.8"/>
                  <rect x="330" y="120" width="40" height="30" rx="4" fill="#D2691E" opacity="0.8"/>
                  
                  <!-- Chairs -->
                  <rect x="55" y="110" width="8" height="8" rx="2" fill="#654321" opacity="0.9"/>
                  <rect x="67" y="110" width="8" height="8" rx="2" fill="#654321" opacity="0.9"/>
                  <rect x="79" y="110" width="8" height="8" rx="2" fill="#654321" opacity="0.9"/>
                  
                  <rect x="125" y="110" width="8" height="8" rx="2" fill="#654321" opacity="0.9"/>
                  <rect x="137" y="110" width="8" height="8" rx="2" fill="#654321" opacity="0.9"/>
                  
                  <rect x="195" y="110" width="8" height="8" rx="2" fill="#654321" opacity="0.9"/>
                  <rect x="207" y="110" width="8" height="8" rx="2" fill="#654321" opacity="0.9"/>
                  <rect x="219" y="110" width="8" height="8" rx="2" fill="#654321" opacity="0.9"/>
                  
                  <!-- Windows/lighting effect -->
                  <rect x="0" y="0" width="400" height="80" fill="url(#windowGradient)" opacity="0.3"/>
                  
                  <defs>
                    <linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.8" />
                      <stop offset="100%" style="stop-color:#FFD700;stop-opacity:0" />
                    </linearGradient>
                  </defs>
                  
                  <!-- Ambient lighting dots -->
                  <circle cx="80" cy="40" r="3" fill="#FFD700" opacity="0.6"/>
                  <circle cx="160" cy="30" r="2" fill="#FFD700" opacity="0.5"/>
                  <circle cx="240" cy="45" r="3" fill="#FFD700" opacity="0.4"/>
                  <circle cx="320" cy="35" r="2" fill="#FFD700" opacity="0.6"/>
                </svg>
              `)}`
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
          
          {/* Title */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold tracking-wide drop-shadow-lg">
              Table Reservation
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          
          {/* Date and Time Selection */}
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Select Date & Time
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* Time Slot Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Select Time Slot
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
              Select Tables (Multiple Selection Allowed)
            </h2>
            
            {/* Legend */}
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
            
            {/* Table Grid */}
            <div className="space-y-4">
              {/* Table 1 - Full width */}
              <button
                onClick={() => handleTableSelect(1, tables[0].available)}
                className={`
                  w-full h-16 rounded-lg font-semibold text-lg transition-all duration-200 border-2
                  ${getTableButtonClass(1, tables[0].available)}
                `}
                disabled={!tables[0].available}
              >
                Table 1
              </button>
              
              {/* Tables 2, 3, 4 - Three columns */}
              <div className="grid grid-cols-3 gap-4">
                {[2, 3, 4].map((tableNum) => {
                  const table = tables[tableNum - 1];
                  return (
                    <button
                      key={tableNum}
                      onClick={() => handleTableSelect(tableNum, table.available)}
                      className={`
                        h-16 rounded-lg font-semibold text-base transition-all duration-200 border-2
                        ${getTableButtonClass(tableNum, table.available)}
                      `}
                      disabled={!table.available}
                    >
                      Table {tableNum}
                    </button>
                  );
                })}
              </div>
              
              {/* Tables 5, 6, 7 - Three columns */}
              <div className="grid grid-cols-3 gap-4">
                {[5, 6, 7].map((tableNum) => {
                  const table = tables[tableNum - 1];
                  return (
                    <button
                      key={tableNum}
                      onClick={() => handleTableSelect(tableNum, table.available)}
                      className={`
                        h-16 rounded-lg font-semibold text-base transition-all duration-200 border-2
                        ${getTableButtonClass(tableNum, table.available)}
                      `}
                      disabled={!table.available}
                    >
                      Table {tableNum}
                    </button>
                  );
                })}
              </div>
              
              {/* Table 8 - Full width */}
              <button
                onClick={() => handleTableSelect(8, tables[7].available)}
                className={`
                  w-full h-16 rounded-lg font-semibold text-lg transition-all duration-200 border-2
                  ${getTableButtonClass(8, tables[7].available)}
                `}
                disabled={!tables[7].available}
              >
                Table 8
              </button>
            </div>
          </div>

          {/* Selection Summary */}
          {(selectedTables.length > 0 || selectedDate || selectedTimeSlot) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-2">Reservation Summary:</h3>
              <div className="text-sm text-gray-600 space-y-1">
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
          <button
            onClick={handleReserve}
            disabled={!selectedDate || !selectedTimeSlot}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
              ${(selectedDate && selectedTimeSlot)
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 hover:from-yellow-500 hover:to-orange-600 active:from-yellow-600 active:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
}