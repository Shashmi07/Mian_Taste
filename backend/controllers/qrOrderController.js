const QrOrder = require('../models/QrOrder');
const { validationResult } = require('express-validator');

// Get all QR orders with filtering
const getQrOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    
    const orders = await QrOrder.find(filter)
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

// Create new QR order
const createQrOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const order = new QrOrder({
      ...req.body,
      createdBy: req.user ? req.user.id : null
    });

    await order.save();
    
    const populatedOrder = await QrOrder.findById(order._id)
      .populate('createdBy', 'name');

    // Emit to kitchen for chefs
    if (req.io) {
      req.io.to('kitchen').emit('new-qr-order', populatedOrder);
    }

    res.status(201).json({
      success: true,
      message: 'QR order created successfully',
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

// Update QR order status
const updateQrOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cookingStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (cookingStatus) updateData.cookingStatus = cookingStatus;

    const updatedOrder = await QrOrder.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name')
    .populate('assignedChef', 'name');

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'QR Order not found' 
      });
    }

    // Emit socket events
    if (req.io) {
      req.io.to('kitchen').emit('qr-order-updated', updatedOrder);
      // Also emit to order tracking clients
      req.io.emit('qr-order-updated', updatedOrder);
      req.io.emit('qr-order-status-changed', {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        cookingStatus: updatedOrder.cookingStatus
      });
    }

    res.json({
      success: true,
      message: 'QR order updated successfully',
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

// Track QR order by orderId (public route)
const trackQrOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await QrOrder.findOne({ orderId: orderId.toUpperCase() })
      .populate('assignedChef', 'name');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'QR Order not found. Please check your Order ID.'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete QR order (admin only)
const deleteQrOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedOrder = await QrOrder.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'QR Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'QR order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getQrOrders,
  createQrOrder,
  updateQrOrderStatus,
  trackQrOrder,
  deleteQrOrder
};