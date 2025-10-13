import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';

const CustomDatePicker = ({ selectedDate, onChange, minDate }) => {
  const handleDateChange = (date) => {
    // Convert to YYYY-MM-DD format for consistency
    const formattedDate = moment(date).format('YYYY-MM-DD');
    onChange(formattedDate);
  };

  // Convert string date to Date object for DatePicker
  const dateValue = selectedDate ? new Date(selectedDate) : null;
  
  // Set minimum date as today
  const today = moment().tz('Asia/Colombo').startOf('day').toDate();
  
  // Set maximum date as 30 days from today
  const maxDate = moment().tz('Asia/Colombo').add(30, 'days').endOf('day').toDate();

  // Filter function to disable dates outside our range
  const filterDate = (date) => {
    const currentDate = moment(date).startOf('day');
    const minMoment = moment().tz('Asia/Colombo').startOf('day');
    const maxMoment = moment().tz('Asia/Colombo').add(30, 'days').endOf('day');
    return currentDate.isSameOrAfter(minMoment) && currentDate.isSameOrBefore(maxMoment);
  };

  return (
    <DatePicker
      selected={dateValue}
      onChange={handleDateChange}
      minDate={today}
      maxDate={maxDate}
      filterDate={filterDate}
      dateFormat="MMMM d, yyyy"
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 border-gray-300"
      placeholderText="Choose your preferred date"
      showDisabledMonthNavigation
    />
  );
};

export default CustomDatePicker;