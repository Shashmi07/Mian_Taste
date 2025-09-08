const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// All admin analytics routes require authentication
router.use(auth);

// Power BI Data Export - Comprehensive restaurant analytics
router.get('/powerbi-data', async (req, res) => {
  try {
    const { getAdminConnection } = require('../config/adminDatabase');
    const { getCustomerConnection } = require('../config/customerDatabase');
    const QrOrder = require('../models/QrOrder');
    const PreOrder = require('../models/PreOrder');
    const { schema: feedbackSchema } = require('../models/Feedback');
    const { schema: tableReservationSchema } = require('../models/TableReservation');

    // Get database connections
    const adminConnection = getAdminConnection();
    const customerConnection = getCustomerConnection();
    const Feedback = adminConnection.model('Feedback', feedbackSchema);
    const TableReservation = customerConnection.model('TableReservation', tableReservationSchema);

    // Get date range filter
    const { days = 30 } = req.query;
    const dateFilter = {
      createdAt: {
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    };

    // Fetch all data in parallel
    const [qrOrders, preOrders, reservations, feedback] = await Promise.all([
      QrOrder.find(dateFilter).lean(),
      PreOrder.find(dateFilter).lean(),
      TableReservation.find(dateFilter).lean(),
      Feedback.find(dateFilter).lean()
    ]);

    // Process data for Power BI consumption
    const powerBIData = {
      // Orders Summary
      ordersSummary: [
        ...qrOrders.map(order => ({
          orderId: order.orderId,
          orderType: 'QR',
          customerName: order.customerName,
          table: order.table,
          totalAmount: order.totalAmount,
          status: order.status,
          cookingStatus: order.cookingStatus,
          priority: order.priority,
          orderDate: order.createdAt,
          items: order.items?.length || 0,
          estimatedTime: order.estimatedTime
        })),
        ...preOrders.map(order => ({
          orderId: order.orderId,
          orderType: 'Pre-Order',
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          totalAmount: order.totalAmount,
          status: order.status,
          orderDate: order.createdAt,
          scheduledDate: order.scheduledDate,
          scheduledTime: order.scheduledTime,
          serviceType: order.orderType,
          items: order.items?.length || 0,
          paymentMethod: order.paymentMethod
        })),
        ...reservations.map(reservation => ({
          orderId: reservation.reservationId,
          orderType: 'Reservation',
          customerName: reservation.customerName,
          customerEmail: reservation.customerEmail,
          customerPhone: reservation.customerPhone,
          totalAmount: reservation.grandTotal,
          status: reservation.status,
          orderDate: reservation.createdAt,
          reservationDate: reservation.reservationDate,
          timeSlot: reservation.timeSlot,
          selectedTables: reservation.selectedTables?.join(', '),
          hasFood: reservation.hasFood,
          items: reservation.foodItems?.length || 0,
          tableTotal: reservation.tableTotal,
          foodTotal: reservation.foodTotal
        }))
      ],

      // Food Items Analysis
      foodItems: (() => {
        const itemsMap = new Map();
        
        // Process QR orders
        qrOrders.forEach(order => {
          order.items?.forEach(item => {
            const key = item.name;
            if (!itemsMap.has(key)) {
              itemsMap.set(key, {
                itemName: item.name,
                totalQuantity: 0,
                totalRevenue: 0,
                orderCount: 0,
                avgPrice: item.price,
                orderTypes: { qr: 0, pre: 0, reservation: 0 }
              });
            }
            const existing = itemsMap.get(key);
            existing.totalQuantity += item.quantity;
            existing.totalRevenue += (item.price * item.quantity);
            existing.orderCount += 1;
            existing.orderTypes.qr += item.quantity;
          });
        });

        // Process pre-orders
        preOrders.forEach(order => {
          order.items?.forEach(item => {
            const key = item.name;
            if (!itemsMap.has(key)) {
              itemsMap.set(key, {
                itemName: item.name,
                totalQuantity: 0,
                totalRevenue: 0,
                orderCount: 0,
                avgPrice: item.price,
                orderTypes: { qr: 0, pre: 0, reservation: 0 }
              });
            }
            const existing = itemsMap.get(key);
            existing.totalQuantity += item.quantity;
            existing.totalRevenue += (item.price * item.quantity);
            existing.orderCount += 1;
            existing.orderTypes.pre += item.quantity;
          });
        });

        // Process reservations
        reservations.forEach(reservation => {
          reservation.foodItems?.forEach(item => {
            const key = item.name;
            if (!itemsMap.has(key)) {
              itemsMap.set(key, {
                itemName: item.name,
                totalQuantity: 0,
                totalRevenue: 0,
                orderCount: 0,
                avgPrice: item.price,
                orderTypes: { qr: 0, pre: 0, reservation: 0 }
              });
            }
            const existing = itemsMap.get(key);
            existing.totalQuantity += item.quantity;
            existing.totalRevenue += (item.price * item.quantity);
            existing.orderCount += 1;
            existing.orderTypes.reservation += item.quantity;
          });
        });

        return Array.from(itemsMap.values());
      })(),

      // Customer Feedback Analysis
      customerFeedback: feedback.map(fb => ({
        orderId: fb.orderId,
        orderType: fb.orderType,
        customerName: fb.customerInfo?.name,
        customerEmail: fb.customerInfo?.email,
        foodRating: fb.ratings?.food || 0,
        serviceRating: fb.ratings?.service || 0,
        ambianceRating: fb.ratings?.ambiance || 0,
        overallRating: fb.ratings?.overall || 0,
        averageRating: fb.averageRating,
        comment: fb.comment,
        feedbackDate: fb.createdAt
      })),

      // Daily Sales Summary
      dailySales: (() => {
        const salesMap = new Map();
        
        [...qrOrders, ...preOrders, ...reservations].forEach(order => {
          const date = new Date(order.createdAt).toISOString().split('T')[0];
          if (!salesMap.has(date)) {
            salesMap.set(date, {
              date,
              totalOrders: 0,
              totalRevenue: 0,
              qrOrders: 0,
              preOrders: 0,
              reservations: 0,
              qrRevenue: 0,
              preRevenue: 0,
              reservationRevenue: 0
            });
          }
          
          const existing = salesMap.get(date);
          existing.totalOrders += 1;
          
          if (order.orderId?.startsWith('QR') || order.table) {
            existing.qrOrders += 1;
            existing.qrRevenue += order.totalAmount || 0;
            existing.totalRevenue += order.totalAmount || 0;
          } else if (order.orderId?.startsWith('PRE')) {
            existing.preOrders += 1;
            existing.preRevenue += order.totalAmount || 0;
            existing.totalRevenue += order.totalAmount || 0;
          } else if (order.reservationId?.startsWith('RES')) {
            existing.reservations += 1;
            existing.reservationRevenue += order.grandTotal || 0;
            existing.totalRevenue += order.grandTotal || 0;
          }
        });

        return Array.from(salesMap.values()).sort((a, b) => a.date.localeCompare(b.date));
      })(),

      // Hourly Analysis
      hourlyAnalysis: (() => {
        const hourlyMap = new Map();
        
        for (let hour = 0; hour < 24; hour++) {
          hourlyMap.set(hour, {
            hour,
            orderCount: 0,
            revenue: 0,
            qrCount: 0,
            preCount: 0,
            reservationCount: 0
          });
        }

        [...qrOrders, ...preOrders, ...reservations].forEach(order => {
          const hour = new Date(order.createdAt).getHours();
          const existing = hourlyMap.get(hour);
          existing.orderCount += 1;
          
          if (order.orderId?.startsWith('QR') || order.table) {
            existing.qrCount += 1;
            existing.revenue += order.totalAmount || 0;
          } else if (order.orderId?.startsWith('PRE')) {
            existing.preCount += 1;
            existing.revenue += order.totalAmount || 0;
          } else if (order.reservationId?.startsWith('RES')) {
            existing.reservationCount += 1;
            existing.revenue += order.grandTotal || 0;
          }
        });

        return Array.from(hourlyMap.values());
      })(),

      // Inventory Recommendations
      inventoryRecommendations: (() => {
        const itemsMap = new Map();
        
        [...qrOrders, ...preOrders, ...reservations].forEach(order => {
          const items = order.items || order.foodItems || [];
          items.forEach(item => {
            if (!itemsMap.has(item.name)) {
              itemsMap.set(item.name, {
                itemName: item.name,
                dailyAverage: 0,
                weeklyForecast: 0,
                recommendedStock: 0,
                reorderLevel: 0
              });
            }
            itemsMap.get(item.name).dailyAverage += item.quantity;
          });
        });

        return Array.from(itemsMap.values()).map(item => {
          item.dailyAverage = Math.round(item.dailyAverage / days);
          item.weeklyForecast = item.dailyAverage * 7;
          item.recommendedStock = Math.ceil(item.weeklyForecast * 1.2); // 20% buffer
          item.reorderLevel = Math.ceil(item.dailyAverage * 3); // 3-day safety stock
          return item;
        }).sort((a, b) => b.dailyAverage - a.dailyAverage);
      })()
    };

    res.json({
      success: true,
      data: powerBIData,
      metadata: {
        dateRange: `Last ${days} days`,
        generatedAt: new Date(),
        recordCounts: {
          orders: powerBIData.ordersSummary.length,
          foodItems: powerBIData.foodItems.length,
          feedback: powerBIData.customerFeedback.length,
          dailyReports: powerBIData.dailySales.length
        }
      }
    });

  } catch (error) {
    console.error('Error generating Power BI data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate analytics data',
      error: error.message
    });
  }
});

// Power BI Authentication Token (you'll need to implement based on your Power BI setup)
router.get('/powerbi-token', async (req, res) => {
  try {
    // This is where you'd integrate with Microsoft Power BI REST API
    // For now, return configuration for embedding
    const config = {
      // You'll need to set these in your .env file after Power BI setup
      workspaceId: process.env.POWERBI_WORKSPACE_ID,
      reportId: process.env.POWERBI_REPORT_ID,
      embedUrl: process.env.POWERBI_EMBED_URL,
      // Note: In production, generate this token server-side using Power BI API
      instructions: 'Please configure Power BI credentials in .env file'
    };

    res.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error fetching Power BI config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Power BI configuration'
    });
  }
});

module.exports = router;