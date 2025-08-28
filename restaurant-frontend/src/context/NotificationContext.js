import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted' && notification.priority === 'high') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: 'reservation-update'
      });
    }
    
    return newNotification.id;
  };

  // Add a reservation confirmation notification
  const addReservationConfirmation = (reservationData) => {
    return addNotification({
      type: 'reservation_confirmed',
      title: '✅ Reservation Confirmed!',
      message: `Your table reservation (${reservationData.reservationId}) has been confirmed by our admin.`,
      details: {
        reservationId: reservationData.reservationId,
        date: reservationData.reservationDate,
        timeSlot: reservationData.timeSlot,
        tables: reservationData.selectedTables,
        customerName: reservationData.customerName
      },
      priority: 'high'
    });
  };

  // Add a reservation cancellation notification
  const addReservationCancellation = (reservationData) => {
    return addNotification({
      type: 'reservation_cancelled',
      title: '❌ Reservation Cancelled',
      message: `Your table reservation (${reservationData.reservationId}) has been cancelled.`,
      details: {
        reservationId: reservationData.reservationId,
        date: reservationData.reservationDate,
        timeSlot: reservationData.timeSlot,
        tables: reservationData.selectedTables,
        customerName: reservationData.customerName
      },
      priority: 'high'
    });
  };

  // Check for reservation status updates for the logged-in customer
  const checkForReservationUpdates = async () => {
    try {
      const customerToken = localStorage.getItem('customerToken');
      const customerUser = localStorage.getItem('customerUser');
      
      if (!customerToken || !customerUser) {
        return; // Not logged in
      }

      // Get customer email to check for their reservations
      const userData = JSON.parse(customerUser);
      const customerEmail = userData.email;
      
      if (!customerEmail) {
        return;
      }

      // Check recent reservations and their status
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/table-reservations`);
      const data = await response.json();
      
      if (data.success && data.reservations) {
        // Find customer's reservations
        const customerReservations = data.reservations.filter(
          res => res.customerEmail === customerEmail
        );
        
        // Get last checked timestamp
        const lastChecked = localStorage.getItem('lastReservationCheck');
        const lastCheckedTime = lastChecked ? new Date(lastChecked) : new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        
        // Check for status updates since last check
        customerReservations.forEach(reservation => {
          const reservationTime = new Date(reservation.updatedAt || reservation.createdAt);
          
          if (reservationTime > lastCheckedTime) {
            // Check if we already have a notification for this reservation
            const existingNotification = notifications.find(
              n => n.details?.reservationId === reservation.reservationId
            );
            
            if (!existingNotification) {
              if (reservation.status === 'confirmed') {
                addReservationConfirmation(reservation);
              } else if (reservation.status === 'cancelled') {
                addReservationCancellation(reservation);
              }
            }
          }
        });
        
        // Update last checked timestamp
        localStorage.setItem('lastReservationCheck', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error checking for reservation updates:', error);
    }
  };

  // Load notifications from localStorage on mount and set up real-time polling
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
    
    // Initial check for customer reservation updates
    checkForReservationUpdates();
    
    // Set up real-time polling every 30 seconds
    const pollInterval = setInterval(() => {
      // Only poll if user is logged in
      const customerToken = localStorage.getItem('customerToken');
      if (customerToken) {
        checkForReservationUpdates();
      }
    }, 30000); // Poll every 30 seconds
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
      addReservationConfirmation,
      addReservationCancellation,
      checkForReservationUpdates,
      requestNotificationPermission
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;