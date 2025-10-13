const PreOrder = require('../models/PreOrder');
const { validationResult } = require('express-validator');
const { sendFeedbackEmail, sendCancellationEmail } = require('../services/emailService');

// Get all preorders with filtering
const getPreOrders = async (req, res) => {
  try {
    const { status, orderType, limit = 1000 } = req.query;
    let filter = {};

    if (status && status !== 'all') filter.status = status;
    if (orderType && orderType !== 'all') filter.orderType = orderType;

    const orders = await PreOrder.find(filter)
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(parseInt(limit));

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new preorder
const createPreOrder = async (req, res) => {
  try {
    console.log('=== CREATE PREORDER REQUEST ===');
    console.log('Request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const {
      orderType,
      scheduledDate,
      scheduledTime,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      table,
      items,
      totalAmount,
      paymentMethod,
      notes
    } = req.body;

    // Validate required fields
    if (!orderType || !scheduledDate || !scheduledTime || !customerName || !customerPhone || !items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: orderType, scheduledDate, scheduledTime, customerName, customerPhone, items, totalAmount'
      });
    }

    // Validate orderType
    const validOrderTypes = ['dine-in', 'takeaway', 'delivery'];
    if (!validOrderTypes.includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid orderType. Must be: dine-in, takeaway, or delivery'
      });
    }

    // Validate delivery address for delivery orders
    if (orderType === 'delivery' && !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required for delivery orders'
      });
    }

    console.log('Validation passed, creating preorder...');

    // Create the preorder
    const preOrder = new PreOrder({
      orderType,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : '',
      table: orderType === 'dine-in' ? table || 'TBD' : '',
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'card',
      notes: notes || '',
      status: 'confirmed'
    });

    await preOrder.save();
    console.log('Preorder saved successfully');

    // No real-time notifications for preorders (they're scheduled)

    res.status(201).json({
      success: true,
      message: 'Preorder placed successfully',
      order: preOrder
    });

  } catch (error) {
    console.error('=== ERROR IN CREATE PREORDER ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create preorder',
      error: error.message
    });
  }
};

// Update preorder status (only confirmed -> completed)
const updatePreOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow confirmed -> completed
    if (status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Preorders can only be marked as completed.'
      });
    }

    const updatedOrder = await PreOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Preorder not found' 
      });
    }

    // Send feedback email when order is completed
    if (status === 'completed' && updatedOrder.customerEmail) {
      console.log(`📧 Sending feedback email for completed pre-order ${updatedOrder.orderId}`);
      
      const emailData = {
        orderId: updatedOrder.orderId,
        orderType: 'pre',
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        preorderOrderType: updatedOrder.orderType, // delivery, dine-in, takeaway
        deliveryAddress: updatedOrder.deliveryAddress
      };
      
      // Send email asynchronously (don't wait for it)
      sendFeedbackEmail(emailData).catch(error => {
        console.error(`Failed to send feedback email for ${updatedOrder.orderId}:`, error);
      });
    }

    res.json({
      success: true,
      message: 'Preorder status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get preorders by date range (useful for scheduling)
const getPreOrdersByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }
    
    const filter = Object.keys(dateFilter).length > 0 ? { scheduledDate: dateFilter } : {};
    
    const orders = await PreOrder.find(filter)
      .sort({ scheduledDate: 1, scheduledTime: 1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Cancel pre-order
const cancelPreOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const preOrder = await PreOrder.findById(id);

    if (!preOrder) {
      return res.status(404).json({
        success: false,
        message: 'Pre-order not found'
      });
    }

    // Check if order is already completed or cancelled
    if (preOrder.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed pre-order'
      });
    }

    if (preOrder.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Pre-order is already cancelled'
      });
    }

    // Update status to cancelled
    preOrder.status = 'cancelled';
    await preOrder.save();

    // Send cancellation email to customer
    if (preOrder.customerEmail) {
      console.log(`📧 Sending cancellation email for pre-order ${preOrder.orderId}`);

      const emailData = {
        orderId: preOrder.orderId,
        orderType: 'pre',
        customerName: preOrder.customerName,
        customerEmail: preOrder.customerEmail
      };

      // Send email asynchronously (don't wait for it)
      sendCancellationEmail(emailData).catch(error => {
        console.error(`Failed to send cancellation email for ${preOrder.orderId}:`, error);
      });
    }

    res.json({
      success: true,
      message: 'Pre-order cancelled successfully and customer has been notified',
      order: preOrder
    });
  } catch (error) {
    console.error('Error cancelling pre-order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getPreOrders,
  createPreOrder,
  updatePreOrderStatus,
  getPreOrdersByDate,
  cancelPreOrder
};