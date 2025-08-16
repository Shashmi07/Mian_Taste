const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create a new table reservation
export const createReservation = async (reservationData) => {
  try {
    console.log('Creating reservation with data:', reservationData);
    console.log('API URL:', `${API_URL}/table-reservations`);
    
    const response = await fetch(`${API_URL}/table-reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Reservation response:', data);
    return data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

// Check table availability for a specific date and time
export const checkAvailability = async (date, timeSlot) => {
  try {
    const url = `${API_URL}/table-reservations/availability?date=${date}&timeSlot=${encodeURIComponent(timeSlot)}`;
    console.log('Checking availability at URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Availability response:', data);
    return data;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

// Get reservation by ID
export const getReservationById = async (reservationId) => {
  try {
    const url = `${API_URL}/table-reservations/${reservationId}`;
    console.log('Fetching reservation at URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reservation:', error);
    throw error;
  }
};