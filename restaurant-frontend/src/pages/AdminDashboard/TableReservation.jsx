import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const TableReservation = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  // Only three statuses: 'available' | 'unavailable' | 'selected'
  const [tables, setTables] = useState([
    { id: 1, label: 'Table 1', status: 'available' },
    { id: 2, label: 'Table 2', status: 'available' },
    { id: 3, label: 'Table 3', status: 'available' },
    { id: 4, label: 'Table 4', status: 'unavailable' },
    { id: 5, label: 'Table 5', status: 'available' },
    { id: 6, label: 'Table 6', status: 'unavailable' },
    { id: 7, label: 'Table 7', status: 'available' },
    { id: 8, label: 'Table 8', status: 'available' },
  ]);

  const statusClasses = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'unavailable':
        return 'bg-red-500 text-white opacity-70 cursor-not-allowed';
      case 'selected':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  // Toggle only between available <-> selected. Unavailable is not clickable.
  const toggleTable = (id) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === 'unavailable') return t; // can't toggle
        return { ...t, status: t.status === 'selected' ? 'available' : 'selected' };
      })
    );
  };

  const selectedTables = tables.filter((t) => t.status === 'selected');

  const reserve = () => {
    alert(
      `Reserved: ${selectedTables.map((t) => t.label).join(', ') || '(none)'}\n` +
      `Date: ${selectedDate || '(choose)'}\nTime: ${timeSlot || '(choose)'}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="mm/dd/yyyy"
          />
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">Choose a time slot</option>
            <option>12:00 PM</option>
            <option>12:30 PM</option>
            <option>1:00 PM</option>
            <option>1:30 PM</option>
            <option>7:00 PM</option>
            <option>7:30 PM</option>
            <option>8:00 PM</option>
          </select>
        </div>
      </div>

      {/* Legend (only three states) */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Select Tables</h3>
        <div className="flex items-center justify-center gap-6 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded bg-green-600" /> Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded bg-red-500" /> Unavailable
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded bg-blue-600" /> Selected
          </span>
        </div>
      </div>

      {/* Table layout: 1 (full) | 2–4 | 5–7 | 8 (full) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Table 1 full width */}
        <button
          type="button"
          onClick={() => toggleTable(1)}
          className={[
            'col-span-1 sm:col-span-3 w-full rounded-xl px-4 py-4 text-center font-semibold transition shadow-sm',
            statusClasses(tables[0].status),
          ].join(' ')}
        >
          {tables[0].label}
        </button>

        {/* Tables 2–4 */}
        {tables.slice(1, 4).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggleTable(t.id)}
            className={[
              'rounded-xl px-4 py-3 text-center font-medium transition shadow-sm',
              statusClasses(t.status),
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}

        {/* Tables 5–7 */}
        {tables.slice(4, 7).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggleTable(t.id)}
            className={[
              'rounded-xl px-4 py-3 text-center font-medium transition shadow-sm',
              statusClasses(t.status),
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}

        {/* Table 8 full width */}
        <button
          type="button"
          onClick={() => toggleTable(8)}
          className={[
            'col-span-1 sm:col-span-3 w-full rounded-xl px-4 py-4 text-center font-semibold transition shadow-sm',
            statusClasses(tables[7].status),
          ].join(' ')}
        >
          {tables[7].label}
        </button>
      </div>

      {/* Reserve button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={reserve}
          disabled={selectedTables.length === 0}
          className={[
            'w-full rounded-xl px-4 py-3 font-semibold transition shadow-sm',
            selectedTables.length === 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white',
          ].join(' ')}
        >
          Reserve Now
        </button>
      </div>
    </div>
  );
};

export default TableReservation;
