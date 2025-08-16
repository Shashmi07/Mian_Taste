const Order = require('../models/order');
const { validationResult } = require('express-validator');

// Get all orders with filtering
const getOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'name')
      .populate('assignedChef', 'name');
    
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

// Create new order
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const order = new Order({
      ...req.body,
      createdBy: req.user.id
    });

    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('createdBy', 'name');

    // Emit to kitchen for chefs
    req.io.to('kitchen').emit('new-order', populatedOrder);
    
    // Emit to customer's personal room
    req.io.to(`user_${req.user.id}`).emit('order-created', {
      orderId: order._id,
      orderNumber: order.orderId,
      message: 'Your order has been placed successfully!'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    console.log('=== UPDATE ORDER STATUS ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('User:', req.user?.id);

    const { id } = req.params;
    const { status, cookingStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (cookingStatus) updateData.cookingStatus = cookingStatus;

    console.log('Update data:', updateData);

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name')
    .populate('assignedChef', 'name');

    if (!updatedOrder) {
      console.log('❌ Order not found with ID:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    console.log('✅ Order updated successfully');
    console.log('Updated order:', updatedOrder);

    // Emit socket events
    console.log('Emitting socket events...');
    req.io.to('kitchen').emit('order-updated', updatedOrder);
    req.io.to(`order_${updatedOrder._id}`).emit('order-updated', updatedOrder);
    
    req.io.to(`order_${updatedOrder._id}`).emit('order-status-changed', {
      orderId: updatedOrder._id,
      orderNumber: updatedOrder.orderId,
      status: updatedOrder.status,
      cookingStatus: updatedOrder.cookingStatus,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Socket events emitted');

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Accept order
const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status: 'accepted',
        assignedChef: req.user.id
      },
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name')
    .populate('assignedChef', 'name');

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Emit socket event
    req.io.emit('order-accepted', updatedOrder);

    res.json({
      success: true,
      message: 'Order accepted successfully',
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

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Emit socket event
    req.io.emit('order-deleted', { orderId: req.params.id });

    res.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get customer's orders
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('assignedChef', 'name');
    
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

// Track order by orderId (public route)
const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Find order by orderId (ORD001, ORD002, etc.)
    const order = await Order.findOne({ orderId: orderId.toUpperCase() })
      .populate('assignedChef', 'name');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please check your Order ID.'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  acceptOrder,
  deleteOrder,
  getCustomerOrders,
  trackOrder // Export the new function
};