import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import NavBar from '../components/NavBar'; // Adjust the import path as necessary



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
    { id: 8, number: 8, available: false }
  ];

  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'
  ];

  const today = new Date().toISOString().split('T')[0];

  const handleTableSelect = (tableId, available) => {
    if (!available) return;
    
    setSelectedTables(prev => {
      if (prev.includes(tableId)) {
        return prev.filter(id => id !== tableId);
      } else {
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
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="relative h-32 flex items-center justify-center pt-24">
        <h1 className="text-gray-800 text-3xl font-bold tracking-wide drop-shadow-lg">
          Table Reservation
        </h1>
      </div>
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Select Date & Time
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
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
          <div className="mb-8">
            <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
              Select Tables 
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
                onClick={() => handleTableSelect(1, tables[0].available)}
                className={`
                  w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 border-2
                  ${getTableButtonClass(1, tables[0].available)}
                `}
                disabled={!tables[0].available}
              >
                Table 1
              </button>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((tableNum) => {
                  const table = tables[tableNum - 1];
                  return (
                    <button
                      key={tableNum}
                      onClick={() => handleTableSelect(tableNum, table.available)}
                      className={`
                        h-12 rounded-lg font-semibold text-sm transition-all duration-200 border-2
                        ${getTableButtonClass(tableNum, table.available)}
                      `}
                      disabled={!table.available}
                    >
                      Table {tableNum}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[5, 6, 7].map((tableNum) => {
                  const table = tables[tableNum - 1];
                  return (
                    <button
                      key={tableNum}
                      onClick={() => handleTableSelect(tableNum, table.available)}
                      className={`
                        h-12 rounded-lg font-semibold text-sm transition-all duration-200 border-2
                        ${getTableButtonClass(tableNum, table.available)}
                      `}
                      disabled={!table.available}
                    >
                      Table {tableNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handleTableSelect(8, tables[7].available)}
                className={`
                  w-full h-12 rounded-lg font-semibold text-base transition-all duration-200 border-2
                  ${getTableButtonClass(8, tables[7].available)}
                `}
                disabled={!tables[7].available}
              >
                Table 8
              </button>
            </div>
          </div>
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
       <div className="flex justify-center">
  <button
    onClick={handleReserve}
    disabled={!selectedDate || !selectedTimeSlot}
    className={`
      px-8 py-2 rounded-lg font-bold text-sm transition-all duration-200
      ${(selectedDate && selectedTimeSlot)
        ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-105'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }
    `}
  >
    Reserve Now
  </button>
</div>
        </div>
      </div>
    </div>
  );
}