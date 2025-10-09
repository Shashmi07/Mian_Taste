const mongoose = require('mongoose');
const Order = require('../models/order');
const QrOrder = require('../models/QrOrder');
const PreOrder = require('../models/PreOrder');

// Sample menu items (matching your seedMenu.js)
const menuItems = [
  { name: "Chicken Ramen", price: 1100, category: "ramen" },
  { name: "Egg Ramen", price: 950, category: "ramen" },
  { name: "Pork Ramen", price: 1300, category: "ramen" },
  { name: "Beef Ramen", price: 1500, category: "ramen" },
  { name: "Seafood Ramen", price: 1400, category: "ramen" },
  { name: "Vegan Ramen", price: 850, category: "ramen" },
  { name: "Pork and Beef Ramen", price: 1600, category: "ramen" },
  { name: "Buldak Chicken Ramen", price: 1200, category: "ramen" },
  { name: "Buldak Black Ramen", price: 950, category: "ramen" },
  { name: "Buldak Pork Ramen", price: 1300, category: "ramen" },
  { name: "Buldak Beef Ramen", price: 1400, category: "ramen" },
  { name: "Buldak Beef and Pork Ramen", price: 1500, category: "ramen" },
  { name: "Cheese Ramen", price: 1000, category: "ramen" },
  { name: "Cheese Chicken Ramen", price: 1250, category: "ramen" },
  { name: "Cheese Pork Ramen", price: 1350, category: "ramen" },
  { name: "Cheese Beef Ramen", price: 1500, category: "ramen" },
  { name: "Cheese Beef and Pork Ramen", price: 1600, category: "ramen" },
  { name: "Chicken Fried Rice", price: 1100, category: "rice" },
  { name: "Vegetable Fried Rice", price: 950, category: "rice" },
  { name: "Egg Fried Rice", price: 950, category: "rice" },
  { name: "Pork Fried Rice", price: 1300, category: "rice" },
  { name: "Beef Fried Rice", price: 1500, category: "rice" },
  { name: "Beef and Pork Fried Rice", price: 1600, category: "rice" }
];

const customerNames = [
  "John Smith", "Sarah Johnson", "Mike Chen", "Emily Davis", "David Wilson",
  "Lisa Brown", "James Miller", "Jessica Garcia", "Robert Taylor", "Maria Rodriguez",
  "Christopher Lee", "Ashley Martinez", "Matthew Anderson", "Amanda White", "Daniel Thompson",
  "Jennifer Lopez", "Michael Jackson", "Amy Cooper", "Kevin Park", "Rachel Kim"
];

const phoneNumbers = [
  "+1234567890", "+1234567891", "+1234567892", "+1234567893", "+1234567894",
  "+1234567895", "+1234567896", "+1234567897", "+1234567898", "+1234567899"
];

const deliveryAddresses = [
  "123 Main St, Downtown", "456 Oak Ave, Suburb", "789 Pine Rd, Uptown",
  "321 Elm Dr, Midtown", "654 Maple Ln, Westside", "987 Cedar Blvd, Eastside",
  "147 Birch Way, Northside", "258 Spruce St, Southside", "369 Walnut Ave, Central",
  "159 Cherry Rd, Riverside"
];

// Helper functions
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomOrderItems = () => {
  const numItems = randomInt(1, 4); // 1-4 items per order
  const orderItems = [];
  const usedItems = new Set();

  for (let i = 0; i < numItems; i++) {
    let item;
    do {
      item = randomChoice(menuItems);
    } while (usedItems.has(item.name));

    usedItems.add(item.name);
    const quantity = randomInt(1, 3); // 1-3 of each item

    orderItems.push({
      name: item.name,
      quantity: quantity,
      price: item.price
    });
  }

  return orderItems;
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Generate dates from last 30 days to today
const getRandomDate = () => {
  const now = new Date();
  const daysAgo = randomInt(0, 29); // 0-29 days ago
  const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

  // Random hour between 10 AM and 10 PM
  const hour = randomInt(10, 22);
  const minute = randomInt(0, 59);

  date.setHours(hour, minute, 0, 0);
  return date;
};

const getRandomTime = () => {
  const hour = randomInt(10, 22);
  const minute = randomInt(0, 59);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Generate realistic orders
const generateOrders = () => {
  const orders = [];

  // Generate 50 regular orders
  for (let i = 0; i < 50; i++) {
    const orderType = randomChoice(['dine-in', 'takeaway', 'delivery']);
    const items = getRandomOrderItems();
    const createdAt = getRandomDate();

    const order = {
      table: orderType === 'dine-in' ? `T${randomInt(1, 20).toString().padStart(2, '0')}` : undefined,
      orderType: orderType,
      customerPhone: randomChoice(phoneNumbers),
      customerEmail: `${randomChoice(customerNames).toLowerCase().replace(' ', '.')}@email.com`,
      deliveryAddress: orderType === 'delivery' ? randomChoice(deliveryAddresses) : undefined,
      customerName: randomChoice(customerNames),
      items: items,
      totalAmount: calculateTotal(items),
      status: randomChoice(['pending', 'accepted', 'ready', 'delivered', 'cancelled']),
      cookingStatus: randomChoice(['not started', 'preparing', 'cooking', 'plating', 'ready']),
      priority: randomChoice(['low', 'medium', 'high', 'urgent']),
      estimatedTime: `${randomInt(15, 45)} min`,
      orderTime: getRandomTime(),
      notes: randomChoice([null, "Extra spicy", "No vegetables", "Extra cheese", "Well done", "Mild spice"]),
      createdAt: createdAt,
      updatedAt: createdAt
    };

    orders.push(order);
  }

  return orders;
};

// Generate QR orders (table orders through QR code)
const generateQrOrders = () => {
  const qrOrders = [];

  // Generate 30 QR orders
  for (let i = 0; i < 30; i++) {
    const items = getRandomOrderItems();
    const createdAt = getRandomDate();

    const order = {
      table: `T${randomInt(1, 20).toString().padStart(2, '0')}`,
      customerName: randomChoice(customerNames),
      items: items,
      totalAmount: calculateTotal(items),
      status: randomChoice(['pending', 'accepted', 'ready', 'delivered', 'cancelled']),
      cookingStatus: randomChoice(['not started', 'preparing', 'cooking', 'plating', 'ready']),
      priority: randomChoice(['low', 'medium', 'high', 'urgent']),
      estimatedTime: `${randomInt(15, 45)} min`,
      orderTime: getRandomTime(),
      notes: randomChoice([null, "Table service", "Birthday celebration", "Business meeting", "Family dinner"]),
      createdAt: createdAt,
      updatedAt: createdAt
    };

    qrOrders.push(order);
  }

  return qrOrders;
};

// Generate pre-orders (scheduled orders)
const generatePreOrders = () => {
  const preOrders = [];

  // Generate 20 pre-orders for future dates
  for (let i = 0; i < 20; i++) {
    const items = getRandomOrderItems();
    const now = new Date();
    const futureDate = new Date(now.getTime() + (randomInt(1, 7) * 24 * 60 * 60 * 1000)); // 1-7 days in future
    const orderType = randomChoice(['dine-in', 'takeaway', 'delivery']);

    const order = {
      table: orderType === 'dine-in' ? `T${randomInt(1, 20).toString().padStart(2, '0')}` : undefined,
      orderType: orderType,
      scheduledDate: futureDate,
      scheduledTime: getRandomTime(),
      customerPhone: randomChoice(phoneNumbers),
      customerEmail: `${randomChoice(customerNames).toLowerCase().replace(' ', '.')}@email.com`,
      deliveryAddress: orderType === 'delivery' ? randomChoice(deliveryAddresses) : undefined,
      customerName: randomChoice(customerNames),
      items: items,
      totalAmount: calculateTotal(items),
      status: randomChoice(['confirmed', 'completed']), // PreOrder uses confirmed/completed status
      paymentMethod: randomChoice(['card', 'cash', 'upi']),
      orderTime: getRandomTime(),
      notes: randomChoice([null, "Pre-order for pickup", "Special occasion", "Corporate lunch", "Party order"]),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    preOrders.push(order);
  }

  return preOrders;
};

// Main seeding function
const seedOrders = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_main', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to main database');

    // Clear existing orders
    await Order.deleteMany({});
    await QrOrder.deleteMany({});
    await PreOrder.deleteMany({});

    console.log('Cleared existing orders');

    // Generate orders data
    const orders = generateOrders();
    const qrOrders = generateQrOrders();
    const preOrders = generatePreOrders();

    console.log('Inserting orders...');

    // Insert orders individually to trigger pre-save hooks for orderId generation
    const insertedOrders = [];
    for (const orderData of orders) {
      const order = new Order(orderData);
      await order.save();
      insertedOrders.push(order);
    }

    const insertedQrOrders = [];
    for (const orderData of qrOrders) {
      const order = new QrOrder(orderData);
      await order.save();
      insertedQrOrders.push(order);
    }

    const insertedPreOrders = [];
    for (const orderData of preOrders) {
      const order = new PreOrder(orderData);
      await order.save();
      insertedPreOrders.push(order);
    }

    console.log(`Successfully inserted:
    - ${insertedOrders.length} regular orders
    - ${insertedQrOrders.length} QR orders
    - ${insertedPreOrders.length} pre-orders
    Total: ${insertedOrders.length + insertedQrOrders.length + insertedPreOrders.length} orders`);

    // Verify the insertion
    const totalOrders = await Order.countDocuments() +
                       await QrOrder.countDocuments() +
                       await PreOrder.countDocuments();

    console.log(`Verification: ${totalOrders} total orders now in database`);

    // Show some sample analytics data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    const todayRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    console.log(`Today's analytics:
    - Orders: ${todayOrders}
    - Revenue: $${todayRevenue[0]?.total || 0}`);

    console.log('Order seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error in seeding process:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedOrders();