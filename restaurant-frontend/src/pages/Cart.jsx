import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, Clock, Star, QrCode, Calendar, UtensilsCrossed, Package, Truck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI, preOrderAPI } from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, subtotal, tax, total, updateQuantity, removeFromCart, clearCart } = useCart();

  const [isTableOrder, setIsTableOrder] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isQROrder, setIsQROrder] = useState(false);
  
  // Reservation context
  const [reservationContext, setReservationContext] = useState(null);
  const [isReservationOrder, setIsReservationOrder] = useState(false);
  
  // Preorder context
  const [preorderContext, setPreorderContext] = useState(null);
  const [isPreorderOrder, setIsPreorderOrder] = useState(false);
  
  // Delivery context authentication
  const [isDeliveryOrder, setIsDeliveryOrder] = useState(false);
  const [needsAuthentication, setNeedsAuthentication] = useState(false);
  
  // Ref to track if we've cleaned up to prevent multiple cleanups
  const hasCleanedUp = useRef(false);
  // Ref to prevent cleanup during order creation
  const isCreatingOrderRef = useRef(false);
  
  // Mark that user visited cart page
  useEffect(() => {
    localStorage.setItem('visitedCart', 'true');
    
    return () => {
      // Clean up on unmount - don't clear cart here, let menu pages handle it
    };
  }, []);

  // Check for different order contexts with proper priority
  useEffect(() => {
    console.log('Cart: Checking for order contexts...');
    
    // Priority 1: QR order (highest priority)
    const qrTable = localStorage.getItem('qrTableNumber');
    if (qrTable) {
      console.log('Cart: QR table found:', qrTable);
      setIsQROrder(true);
      setIsTableOrder(true);
      setTableNumber(qrTable);
      setCustomerName('Table ' + qrTable + ' Guest');
      return; // Exit early
    }

    // Priority 2: Check for preorder context from PreOrder page (HIGH priority)
    const preorderData = localStorage.getItem('preorderContext');
    if (preorderData) {
      try {
        const preorder = JSON.parse(preorderData);
        console.log('Cart: Preorder context found:', preorder);
        setPreorderContext(preorder);
        setIsPreorderOrder(true);
        
        // Auto-fill customer name from login if available
        const customerToken = localStorage.getItem('customerToken');
        const customerUser = localStorage.getItem('customerUser');
        if (customerToken && customerUser) {
          try {
            const userData = JSON.parse(customerUser);
            setCustomerName(userData.name || userData.username || '');
            console.log('Cart: Auto-filled customer name from login:', userData.name || userData.username);
            console.log('Cart: Available user data for preorder:', userData);
          } catch (error) {
            console.error('Error parsing customer data for name:', error);
          }
        }
        
        // Set order type based on preorder selection
        if (preorder.orderType === 'dine-in') {
          setIsTableOrder(true);
          setTableNumber(''); // Will be filled by user
        } else {
          setIsTableOrder(false); // For takeaway/delivery
        }
        return; // Exit early
      } catch (error) {
        console.error('Cart: Error parsing preorder context:', error);
        localStorage.removeItem('preorderContext');
      }
    }

    // Priority 3: Check for pending table+food reservation (HIGH PRIORITY - before delivery)
    const pendingReservation = localStorage.getItem('pendingReservation');
    if (pendingReservation) {
      try {
        const reservation = JSON.parse(pendingReservation);
        console.log('Cart: Pending reservation found:', reservation);
        // Proceed if it's a table+food reservation (even if preOrder is initially empty)
        if (reservation.type === 'table-food' && reservation.data.preOrder !== undefined) {
          const reservationData = reservation.data;
          
          // Transform reservation data to reservation context format for compatibility
          const context = {
            reservationId: reservation.reservationId || 'TEMP-' + Date.now(),
            customerName: reservationData.customerName,
            tableDetails: {
              tables: reservationData.selectedTables,
              date: reservationData.reservationDate,
              timeSlot: reservationData.timeSlot
            },
            tableAmount: reservationData.tableCost.totalTableCost
          };
          
          setReservationContext(context);
          setIsReservationOrder(true);
          setIsTableOrder(true);
          setIsDeliveryOrder(false); // ✅ NOT a delivery order!
          setTableNumber(reservationData.selectedTables.join(', '));
          setCustomerName(reservationData.customerName);
          console.log('Cart: Table+Food reservation activated:', context);
          return; // Exit early
        }
      } catch (error) {
        console.error('Cart: Error parsing pending reservation:', error);
        localStorage.removeItem('pendingReservation');
      }
    }
    
    // Priority 4: Check for legacy reservation context
    const storedReservationContext = localStorage.getItem('reservationContext');
    if (storedReservationContext) {
      try {
        const context = JSON.parse(storedReservationContext);
        console.log('Cart: Legacy reservation context found:', context);
        setReservationContext(context);
        setIsReservationOrder(true);
        setIsTableOrder(true);
        setIsDeliveryOrder(false); // ✅ NOT a delivery order!
        setTableNumber(context.tableDetails.tables.join(', '));
        setCustomerName(context.customerName);
        return; // Exit early
      } catch (error) {
        console.error('Cart: Error parsing reservation context:', error);
        localStorage.removeItem('reservationContext');
      }
    }

    // Priority 5: Check for delivery context (direct website visitors - LOWEST priority)
    const deliveryContext = localStorage.getItem('deliveryContext');
    if (deliveryContext === 'true') {
      console.log('Cart: Delivery context found - checking authentication');
      const customerToken = localStorage.getItem('customerToken');
      const customerUser = localStorage.getItem('customerUser');

      if (customerToken && customerUser) {
        try {
          const userData = JSON.parse(customerUser);
          console.log('Cart: Authenticated delivery order for:', userData.name || userData.username);
          setIsTableOrder(false); // Delivery order, not table order
          setIsDeliveryOrder(true);
          setCustomerName(userData.name || userData.username || '');
          setNeedsAuthentication(false);
          return; // Exit early - authenticated delivery order
        } catch (error) {
          console.error('Error parsing customer data for delivery:', error);
        }
      } else {
        console.log('Cart: Delivery order requires authentication');
        setIsDeliveryOrder(true);
        setNeedsAuthentication(true);
        return; // Exit early - will handle in UI
      }
    }
    
    console.log('Cart: No special order context found, using default behavior');
  }, []);

  // Listen for navigation changes and clear preorder context when leaving cart
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isPreorderOrder && !isCreatingOrder) {
        console.log('Cart: Clearing preorder context on page unload');
        localStorage.removeItem('preorderContext');
      }
    };

    // Clear preorder context when navigating away from cart
    const clearPreorderContext = () => {
      if (isPreorderOrder && !isCreatingOrder) {
        console.log('Cart: Clearing preorder context on navigation');
        localStorage.removeItem('preorderContext');
      }
    };

    // Listen for browser navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Custom event for when user navigates away from cart
    window.addEventListener('cartExit', clearPreorderContext);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('cartExit', clearPreorderContext);
      // Also clear on unmount as fallback - but NOT if we're creating an order
      if (isPreorderOrder && !isCreatingOrderRef.current) {
        console.log('Cart: Clearing preorder context on unmount');
        localStorage.removeItem('preorderContext');
      } else if (isCreatingOrderRef.current) {
        console.log('Cart: Skipping cleanup - order creation in progress');
      }
    };
  }, [isPreorderOrder, isCreatingOrder]);

  // Don't auto-cleanup on location changes - only clean up on specific back actions

  // Only clean up on browser back button, not on regular navigation
  useEffect(() => {
    // Listen for browser back button (popstate)
    const handlePopState = () => {
      // If user used browser back button from cart, clean up immediately
      if (isPreorderOrder && !isCreatingOrder && location.pathname === '/cart') {
        console.log('Cart: Browser back button detected, cleaning preorder context');
        localStorage.removeItem('preorderContext');
        hasCleanedUp.current = true;
      }
    };

    // Listen for beforeunload (when page is about to be closed/refreshed)
    const handleBeforeUnload = (e) => {
      // Show confirmation if cart has items and not currently placing order
      if (cartItems.length > 0 && !isCreatingOrder) {
        const confirmationMessage = 'You have items in your cart. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = confirmationMessage; // Required for Chrome
        return confirmationMessage; // Required for some browsers
      }

      if (isPreorderOrder && !isCreatingOrder) {
        console.log('Cart: Page unload, cleaning preorder context');
        localStorage.removeItem('preorderContext');
      }
    };

    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on unmount - but only for specific cases
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPreorderOrder, isCreatingOrder, location.pathname, cartItems.length]);

  // Render star rating
  const renderStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-3 h-3 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }
    
    return stars;
  };

  // Handle order creation
  const handleCreateOrder = async () => {
    if (cartItems.length === 0) return;
    
    // Validation
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (isTableOrder && !isPreorderOrder && !tableNumber.trim()) {
      alert('Please enter table number for dine-in orders');
      return;
    }

    setIsCreatingOrder(true);
    isCreatingOrderRef.current = true;

    try {
      // Validate cart items before creating order
      console.log('Cart items before validation:', cartItems);
      const validItems = cartItems.filter(item => {
        const isValid = item.name && item.quantity > 0 && item.price;
        if (!isValid) {
          console.warn('Invalid cart item:', item);
        }
        return isValid;
      });

      if (validItems.length === 0) {
        throw new Error('No valid items in cart');
      }

      // Prepare order data based on order type
      let orderData;
      
      if (isPreorderOrder && preorderContext) {
        // Get customer data from login for phone/email/address
        let customerPhone = '';
        let customerEmail = '';
        let customerAddress = '';

        try {
          const customerUser = localStorage.getItem('customerUser');
          if (customerUser) {
            const userData = JSON.parse(customerUser);
            customerPhone = userData.phoneNumber || userData.phone || '';
            customerEmail = userData.email || '';
            customerAddress = userData.address || ''; // Fetch address from customer profile
          }
        } catch (error) {
          console.error('Error getting customer data for preorder:', error);
        }

        // If no phone from login, use a placeholder to satisfy required field
        if (!customerPhone) {
          customerPhone = '0000000000'; // Placeholder - should be replaced with proper form collection
        }

        // For delivery preorders, use customer's saved address from profile (same as regular delivery)
        const deliveryAddressForOrder = preorderContext.orderType === 'delivery'
          ? (customerAddress || 'Customer will be contacted for address')
          : '';

        // Preorder data structure (matches preOrderController expectations)
        orderData = {
          orderType: preorderContext.orderType,
          scheduledDate: preorderContext.scheduledDate,
          scheduledTime: preorderContext.scheduledTime,
          customerName: customerName.trim(),
          customerPhone: customerPhone,
          customerEmail: customerEmail,
          deliveryAddress: deliveryAddressForOrder,
          table: preorderContext.orderType === 'dine-in' ? (tableNumber?.trim() || 'TBD') : '',
          items: validItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: typeof item.price === 'number' ? item.price : parseInt(item.price) || 0
          })),
          totalAmount: total,
          paymentMethod: 'card',
          notes: `Pre-order for ${preorderContext.orderType} on ${preorderContext.scheduledDate} at ${preorderContext.scheduledTime}`
        };
        console.log('Creating preorder with data:', orderData);
      } else if (isDeliveryOrder) {
        // Delivery order data structure (for preOrderAPI)
        let customerPhone = '';
        let customerEmail = '';
        
        try {
          const customerUser = localStorage.getItem('customerUser');
          if (customerUser) {
            const userData = JSON.parse(customerUser);
            customerPhone = userData.phoneNumber || userData.phone || '';
            customerEmail = userData.email || '';
          }
        } catch (error) {
          console.error('Error getting customer data for delivery order:', error);
        }

        // If no phone from login, use a placeholder to satisfy required field
        if (!customerPhone) {
          customerPhone = '0000000000'; // Placeholder - should be replaced with proper form collection
        }

        // Create immediate delivery order (scheduled for "now")
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format

        orderData = {
          orderType: 'delivery',
          scheduledDate: currentDate,
          scheduledTime: currentTime,
          customerName: customerName.trim(),
          customerPhone: customerPhone,
          customerEmail: customerEmail,
          deliveryAddress: 'Customer will be contacted for address', // Placeholder - should be collected in forms
          table: '', // Not applicable for delivery
          items: validItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: typeof item.price === 'number' ? item.price : parseInt(item.price) || 0
          })),
          totalAmount: total,
          paymentMethod: 'card',
          notes: `Online delivery order - immediate delivery requested`
        };
        console.log('Creating delivery order with preorder data structure:', orderData);
      } else {
        // Regular order data structure
        orderData = {
          table: isTableOrder ? tableNumber.trim() : 'Regular order',
          customerName: customerName.trim(),
          items: validItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: typeof item.price === 'number' ? item.price : parseInt(item.price) || 0
          })),
          totalAmount: total,
          notes: isTableOrder ? `Dine-in order for ${tableNumber}` : 'Regular order'
        };
        console.log('Creating regular order with data:', orderData);
      }

      // Create order - use different API based on order type
      let response;
      if (isPreorderOrder) {
        console.log('Using preOrderAPI endpoint: /api/pre-orders');
        try {
          response = await preOrderAPI.createPreOrder(orderData);
          console.log('API call completed, response:', response);
        } catch (apiError) {
          console.error('API call failed:', apiError);
          throw apiError; // Re-throw to be caught by outer catch
        }
      } else if (isQROrder) {
        console.log('Using QR order API endpoint: /api/qr-orders/public');
        // Use API URL from environment variable
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        console.log('Backend URL:', API_URL);

        response = await fetch(`${API_URL}/qr-orders/public`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        response = { data: await response.json() };
      } else if (isDeliveryOrder) {
        console.log('Using preOrderAPI endpoint for delivery order: /api/pre-orders');
        response = await preOrderAPI.createPreOrder(orderData);
      } else {
        console.log('Using ordersAPI endpoint: /api/orders/public');
        response = await ordersAPI.createOrder(orderData);
      }
      console.log('API response:', response);
      
      if (response.data && response.data.success) {
        const order = response.data.order;
        console.log('Order created successfully:', order);
        
        // Store order info for payment page
        const orderForPayment = {
          orderId: order.orderId || order._id,
          orderNumber: order._id,
          total: total,
          items: cartItems,
          customerName: customerName,
          table: isTableOrder ? tableNumber : 'Pre-order',
          createdAt: new Date().toISOString(),
          type: isPreorderOrder ? 'preorder' : (isQROrder ? 'qr-order' : (isDeliveryOrder ? 'delivery' : 'regular')),
          preorderDetails: isPreorderOrder && preorderContext ? {
            orderType: preorderContext.orderType,
            scheduledDate: preorderContext.scheduledDate,
            scheduledTime: preorderContext.scheduledTime,
            deliveryAddress: preorderContext.deliveryAddress
          } : (isDeliveryOrder ? {
            orderType: 'delivery',
            scheduledDate: orderData.scheduledDate,
            scheduledTime: orderData.scheduledTime,
            deliveryAddress: orderData.deliveryAddress
          } : null)
        };
        
        // If it's a reservation order, add reservation-specific data
        if (isReservationOrder && reservationContext) {
          orderForPayment.type = 'table-food';
          orderForPayment.orderType = 'Table + Food Reservation';
          orderForPayment.reservationDetails = {
            reservationId: reservationContext.reservationId,
            tables: reservationContext.tableDetails.tables,
            date: reservationContext.tableDetails.date,
            timeSlot: reservationContext.tableDetails.timeSlot,
            tableAmount: reservationContext.tableAmount,
            // Add food order data for table+food reservations
            hasFood: true,
            foodItems: cartItems,
            foodTotal: total,
            grandTotal: total + reservationContext.tableAmount
          };
          // Update total to include table reservation cost
          orderForPayment.total = total + reservationContext.tableAmount;
        }
        
        localStorage.setItem('currentOrder', JSON.stringify(orderForPayment));

        // Clear preorder context after successful order creation
        if (isPreorderOrder) {
          localStorage.removeItem('preorderContext');
          console.log('Cart: Preorder context cleared after successful order creation');
        }

        // Navigate to payment
        console.log('Cart: Navigating to payment page...');
        navigate('/payment');
      } else if (response.data) {
        // Handle case where API returns data but no success flag
        const order = response.data;
        console.log('Order created (no success flag):', order);
        
        const orderForPayment = {
          orderId: order.orderId || order._id,
          orderNumber: order._id,
          total: total,
          items: cartItems,
          customerName: customerName,
          table: isTableOrder ? tableNumber : 'Pre-order',
          createdAt: new Date().toISOString(),
          type: isPreorderOrder ? 'preorder' : (isQROrder ? 'qr-order' : (isDeliveryOrder ? 'delivery' : 'regular')),
          preorderDetails: isPreorderOrder && preorderContext ? {
            orderType: preorderContext.orderType,
            scheduledDate: preorderContext.scheduledDate,
            scheduledTime: preorderContext.scheduledTime,
            deliveryAddress: preorderContext.deliveryAddress
          } : (isDeliveryOrder ? {
            orderType: 'delivery',
            scheduledDate: orderData.scheduledDate,
            scheduledTime: orderData.scheduledTime,
            deliveryAddress: orderData.deliveryAddress
          } : null)
        };
        
        // If it's a reservation order, add reservation-specific data
        if (isReservationOrder && reservationContext) {
          orderForPayment.type = 'table-food';
          orderForPayment.orderType = 'Table + Food Reservation';
          orderForPayment.reservationDetails = {
            reservationId: reservationContext.reservationId,
            tables: reservationContext.tableDetails.tables,
            date: reservationContext.tableDetails.date,
            timeSlot: reservationContext.tableDetails.timeSlot,
            tableAmount: reservationContext.tableAmount,
            // Add food order data for table+food reservations
            hasFood: true,
            foodItems: cartItems,
            foodTotal: total,
            grandTotal: total + reservationContext.tableAmount
          };
          // Update total to include table reservation cost
          orderForPayment.total = total + reservationContext.tableAmount;
        }
        
        localStorage.setItem('currentOrder', JSON.stringify(orderForPayment));

        // Clear preorder context after successful order creation
        if (isPreorderOrder) {
          localStorage.removeItem('preorderContext');
          console.log('Cart: Preorder context cleared after successful order creation (no success flag path)');
        }

        console.log('Cart: Navigating to payment page (no success flag path)...');
        navigate('/payment');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to create order. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred.';
      }
      
      alert(errorMessage);
    } finally {
      setIsCreatingOrder(false);
      isCreatingOrderRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg sticky top-0 z-10 pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                // Show confirmation if cart has items
                if (cartItems.length > 0 && !isCreatingOrder) {
                  const confirmed = window.confirm('You have items in your cart. Are you sure you want to leave? Your cart will be emptied.');
                  if (!confirmed) return;

                  // Clear the cart if user confirms
                  clearCart();
                }

                // Clear preorder context when going back from cart
                if (isPreorderOrder && !isCreatingOrder) {
                  localStorage.removeItem('preorderContext');
                  console.log('Cart: Cleared preorder context on back button');
                }
                navigate(-1);
              }}
              className="p-2 rounded-full hover:bg-red-800 hover:bg-opacity-30 transition-colors text-red-100 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 text-red-100" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-600">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">Your Cart</h1>
                  {isQROrder && (
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <QrCode className="w-4 h-4" />
                      Table {tableNumber}
                    </div>
                  )}
                  {isReservationOrder && (
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Reservation Order
                    </div>
                  )}
                  {isPreorderOrder && preorderContext && (
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      {preorderContext.orderType === 'dine-in' && <UtensilsCrossed className="w-4 h-4" />}
                      {preorderContext.orderType === 'takeaway' && <Package className="w-4 h-4" />}
                      {preorderContext.orderType === 'delivery' && <Truck className="w-4 h-4" />}
                      Pre-Order: {preorderContext.orderType === 'delivery' ? 'Online Delivery' : preorderContext.orderType.replace('-', ' ')}
                    </div>
                  )}
                  {isDeliveryOrder && !needsAuthentication && (
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Online Delivery
                    </div>
                  )}
                </div>
                <p className="text-red-100">{cartItems.length} items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {needsAuthentication ? (
          // Authentication required for delivery orders
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sign In Required</h3>
            <p className="text-gray-600 mb-2">You're placing a delivery order!</p>
            <p className="text-gray-600 mb-8">Please sign in to complete your delivery order and provide your delivery address.</p>
            <div className="space-y-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔴 Sign In button clicked - delivery customer authentication');
                  console.log('Current location:', window.location.pathname);
                  console.log('Setting returnAfterLogin to:', '/cart');
                  localStorage.setItem('returnAfterLogin', '/cart');
                  console.log('Navigating to /login...');
                  try {
                    navigate('/login');
                    console.log('✅ Navigate to /login executed');
                  } catch (error) {
                    console.error('❌ Navigation failed:', error);
                  }
                }}
                className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-300 mx-2"
              >
                Sign In
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔴 Create Account button clicked - delivery customer registration');
                  console.log('Current location:', window.location.pathname);
                  console.log('Setting returnAfterLogin to:', '/cart');
                  localStorage.setItem('returnAfterLogin', '/cart');
                  console.log('Navigating to /signup...');
                  try {
                    navigate('/signup');
                    console.log('✅ Navigate to /signup executed');
                  } catch (error) {
                    console.error('❌ Navigation failed:', error);
                  }
                }}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300 mx-2"
              >
                Create Account
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Your cart items will be saved while you sign in
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          // Empty cart state
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <button
              onClick={() => {
                // No confirmation needed since cart is empty
                navigate('/menu');
              }}
              className="px-6 py-3 text-white font-semibold rounded-full transition-colors duration-300"
              style={{ backgroundColor: '#dc2626' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          
                          {/* Rating for food items */}
                          {item.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {renderStars(item.rating)}
                              <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                              {(item.category === 'Ramen' || item.category === 'Rice' || item.category === 'Soup') && (
                                <div className="flex items-center gap-1 ml-3">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-600">15-20 min</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Remove button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Price and Quantity Controls */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-lg font-bold" style={{ color: '#dc2626' }}>
                          Rs. {item.price * item.quantity}
                          <span className="text-sm text-gray-500 font-normal ml-1">
                            (Rs. {item.price} each)
                          </span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            style={{ borderColor: '#dc2626', color: '#dc2626' }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="font-semibold text-lg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                            style={{ backgroundColor: '#dc2626' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add more items button */}
              <button
                onClick={() => {
                  // No confirmation needed - customer wants to add more items to their cart
                  navigate('/menu');
                }}
                className="w-full p-4 border-2 border-dashed rounded-2xl text-gray-600 hover:border-red-600 hover:text-red-600 transition-colors"
              >
                + Add more items
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Reservation Details */}
                {isReservationOrder && reservationContext && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Table Reservation Details
                    </h3>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><span className="font-medium">Reservation ID:</span> {reservationContext.reservationId}</p>
                      <p><span className="font-medium">Date:</span> {reservationContext.tableDetails.date}</p>
                      <p><span className="font-medium">Time:</span> {reservationContext.tableDetails.timeSlot}</p>
                      <p><span className="font-medium">Tables:</span> {reservationContext.tableDetails.tables.join(', ')}</p>
                      <div className="mt-3 pt-2 border-t border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Table Reservation:</span>
                          <span className="font-semibold">Rs. {reservationContext.tableAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Customer Name Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isQROrder ? 'Your Name *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    placeholder={isQROrder ? "First name or nickname" : "Enter your name"}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                {/* Order type selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Order Type
                  </label>
                  
                  {isPreorderOrder && preorderContext ? (
                    // Preorder - show the selected option
                    <div className="space-y-2">
                      <label className="flex items-center opacity-75">
                        <input 
                          type="radio" 
                          name="orderType" 
                          value={preorderContext.orderType}
                          checked={true}
                          disabled={true}
                          className="mr-3"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span>
                          {preorderContext.orderType === 'dine-in' && 'Dine-in'}
                          {preorderContext.orderType === 'takeaway' && 'Takeaway'}
                          {preorderContext.orderType === 'delivery' && 'Online Delivery'}
                          {preorderContext.scheduledDate && preorderContext.scheduledTime &&
                            ` - ${new Date(preorderContext.scheduledDate).toLocaleDateString()} at ${preorderContext.scheduledTime}`
                          }
                        </span>
                        <span className="ml-2 text-purple-600">✓</span>
                      </label>
                      {preorderContext.deliveryAddress && (
                        <div className="ml-6 text-sm text-gray-600">
                          Delivery to: {preorderContext.deliveryAddress}
                        </div>
                      )}
                    </div>
                  ) : isReservationOrder ? (
                    // Reservation order - show only table+food reservation option
                    <div className="space-y-2">
                      <label className="flex items-center opacity-75">
                        <input 
                          type="radio" 
                          name="orderType" 
                          value="table-food"
                          checked={true}
                          disabled={true}
                          className="mr-3"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span>Table + Food Reservation</span>
                        <span className="ml-2 text-blue-600">✓</span>
                      </label>
                    </div>
                  ) : isDeliveryOrder ? (
                    // Delivery order - show only online delivery option
                    <div className="space-y-2">
                      <label className="flex items-center opacity-75">
                        <input 
                          type="radio" 
                          name="orderType" 
                          value="online-delivery"
                          checked={true}
                          disabled={true}
                          className="mr-3"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span>Online Delivery</span>
                        <span className="ml-2 text-green-600">✓</span>
                      </label>
                    </div>
                  ) : (
                    // Regular QR or manual order - show original options
                    <div className="space-y-2">
                      <label className={`flex items-center ${isQROrder ? 'opacity-75' : ''}`}>
                        <input 
                          type="radio" 
                          name="orderType" 
                          value="dine-in"
                          checked={isTableOrder}
                          onChange={() => !isQROrder && setIsTableOrder(true)}
                          disabled={isQROrder}
                          className="mr-3"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span>Dine-in (QR Code Order)</span>
                        {isQROrder && <span className="ml-2 text-green-600">✓</span>}
                      </label>
                      <label className={`flex items-center ${isQROrder ? 'opacity-50' : ''}`}>
                        <input 
                          type="radio" 
                          name="orderType" 
                          value="preorder"
                          checked={!isTableOrder}
                          onChange={() => !isQROrder && setIsTableOrder(false)}
                          disabled={isQROrder}
                          className="mr-3"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span>Pre-order</span>
                      </label>
                    </div>
                  )}
                  
                  {/* Table number input - only for QR orders and reservations, not for preorders */}
                  {isTableOrder && !isPreorderOrder && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Table Number *
                        {isQROrder && <span className="text-sm text-red-600 font-normal">(QR Detected)</span>}
                        {isReservationOrder && <span className="text-sm text-blue-600 font-normal">(From Reservation)</span>}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          isQROrder ? "Table detected from QR" : 
                          isReservationOrder ? "Tables from reservation" : 
                          "e.g., Table 5"
                        }
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${
                          isQROrder ? 'bg-green-50' : 
                          isReservationOrder ? 'bg-blue-50' : ''
                        }`}
                        style={{ '--tw-ring-color': '#dc2626' }}
                        readOnly={isQROrder || isReservationOrder}
                        required
                      />
                      {isQROrder && (
                        <p className="text-xs text-gray-500 mt-1">
                          ✅ Table detected from QR code scan.
                        </p>
                      )}
                      {isReservationOrder && (
                        <p className="text-xs text-gray-500 mt-1">
                          ✅ Tables auto-filled from your table reservation.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Food Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  {isReservationOrder && reservationContext && (
                    <div className="flex justify-between text-gray-600">
                      <span>Table Reservation</span>
                      <span>Rs. {reservationContext.tableAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>Rs. {tax}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span style={{ color: '#dc2626' }}>
                      Rs. {isReservationOrder && reservationContext ? total + reservationContext.tableAmount : total}
                    </span>
                  </div>
                </div>

                {/* Checkout button */}
                <button 
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || !customerName.trim() || (isTableOrder && !isPreorderOrder && !tableNumber.trim())}
                  className="w-full py-4 text-white font-bold rounded-full transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: (isCreatingOrder || !customerName.trim() || (isTableOrder && !isPreorderOrder && !tableNumber.trim())) ? '#9ca3af' : '#dc2626' 
                  }}
                  onMouseEnter={(e) => {
                    if (!(isCreatingOrder || !customerName.trim() || (isTableOrder && !isPreorderOrder && !tableNumber.trim()))) {
                      e.target.style.backgroundColor = '#b91c1c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(isCreatingOrder || !customerName.trim() || (isTableOrder && !isPreorderOrder && !tableNumber.trim()))) {
                      e.target.style.backgroundColor = '#dc2626';
                    }
                  }}
                >
                  {isCreatingOrder ? 'Creating Order...' : 'Create Order & Proceed to Payment'}
                </button>

                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;