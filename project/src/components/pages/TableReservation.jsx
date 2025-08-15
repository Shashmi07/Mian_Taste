import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TableReservation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [reservations] = useState([
    {
      id: 'RES-001',
      customerName: 'Ananya Reddy',
      customerEmail: 'ananya.reddy@email.com',
      customerPhone: '+91 98765 43210',
      date: '2024-01-15',
      time: '19:00',
      partySize: 4,
      tableNumber: 12,
      status: 'confirmed',
      specialRequests: 'Anniversary celebration - need romantic setup'
    },
    {
      id: 'RES-002',
      customerName: 'Vikram Gupta',
      customerEmail: 'vikram.gupta@email.com',
      customerPhone: '+91 87654 32109',
      date: '2024-01-15',
      time: '20:30',
      partySize: 2,
      status: 'pending'
    },
    {
      id: 'RES-003',
      customerName: 'Kavya Nair',
      customerEmail: 'kavya.nair@email.com',
      customerPhone: '+91 76543 21098',
      date: '2024-01-15',
      time: '18:00',
      partySize: 6,
      tableNumber: 8,
      status: 'confirmed'
    }
  ]);

  const tables = [
    { id: 1, capacity: 2, status: 'available' },
    { id: 2, capacity: 2, status: 'occupied' },
    { id: 3, capacity: 4, status: 'available' },
    { id: 4, capacity: 4, status: 'reserved' },
    { id: 5, capacity: 6, status: 'available' },
    { id: 6, capacity: 6, status: 'occupied' },
    { id: 7, capacity: 8, status: 'available' },
    { id: 8, capacity: 8, status: 'reserved' },
    { id: 9, capacity: 2, status: 'available' },
    { id: 10, capacity: 4, status: 'occupied' },
    { id: 11, capacity: 4, status: 'available' },
    { id: 12, capacity: 6, status: 'reserved' }
  ];

  const filteredReservations = reservations.filter(res => res.date === selectedDate);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-badge success';
      case 'pending': return 'status-badge warning';
      case 'cancelled': return 'status-badge error';
      case 'completed': return 'status-badge info';
      default: return 'status-badge info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-800';
      case 'occupied': return 'bg-gradient-to-r from-red-100 to-red-200 border-red-300 text-red-800';
      case 'reserved': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-800';
    }
  };

  const totalTables = tables.length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const reservedTables = tables.filter(t => t.status === 'reserved').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Table Reservations
          </h1>
          <p className="text-gray-600">Manage table reservations and availability</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Tables</h3>
          <div className="text-3xl font-bold text-gray-800">{totalTables}</div>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Available</h3>
          <div className="text-3xl font-bold text-green-600">{availableTables}</div>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Occupied</h3>
          <div className="text-3xl font-bold text-red-600">{occupiedTables}</div>
        </div>
        <div className="stat-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Reserved</h3>
          <div className="text-3xl font-bold text-yellow-600">{reservedTables}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="chart-title">Table Layout</h3>
          <div className="grid grid-cols-4 gap-4">
            {tables.map(table => (
              <div
                key={table.id}
                className={`relative p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${getTableStatusColor(table.status)}`}
              >
                <div className="text-lg font-bold">T{table.id}</div>
                <div className="text-sm">{table.capacity} seats</div>
                <div className="absolute top-1 right-1">
                  <Users className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>Reserved</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">
            Reservations for {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredReservations.map(reservation => (
              <div key={reservation.id} className="border border-green-100 rounded-lg p-4 bg-gradient-to-r from-green-50 to-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{reservation.customerName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{reservation.partySize} people</span>
                      </div>
                      {reservation.tableNumber && (
                        <span className="bg-green-100 px-2 py-1 rounded text-xs">
                          Table {reservation.tableNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span className="capitalize">{reservation.status}</span>
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{reservation.customerEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{reservation.customerPhone}</span>
                  </div>
                  {reservation.specialRequests && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                      <strong>Special Requests:</strong> {reservation.specialRequests}
                    </div>
                  )}
                </div>

                {reservation.status === 'pending' && (
                  <div className="flex space-x-2 mt-3">
                    <button className="flex-1 btn-primary py-2 px-3 text-sm">
                      Confirm
                    </button>
                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filteredReservations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No reservations for this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableReservation;