const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Order = require('../models/order');
const Inventory = require('../models/Inventory');

const seedUsers = [
  {
    name: 'Chef Maria',
    email: 'maria@restaurant.com',
    password: 'chef123',
    role: 'chef'
  }
];

const seedInventory = [
  { name: 'Chicken', quantity: 25000, unit: 'g', minStock: 10000, status: 'available' },
  { name: 'Rice', quantity: 8000, unit: 'g', minStock: 15000, status: 'low' },
  { name: 'Tomatoes', quantity: 0, unit: 'g', minStock: 5000, status: 'out of stock' },
  { name: 'Onions', quantity: 40000, unit: 'g', minStock: 10000, status: 'available' },
  { name: 'Fish', quantity: 18000, unit: 'g', minStock: 8000, status: 'available' },
  { name: 'Pasta', quantity: 12000, unit: 'g', minStock: 5000, status: 'available' }
];

const seedOrders = [
  {
    table: 'Table 5',
    customerName: 'John Doe',
    items: [
      { name: 'Chicken Curry', quantity: 1, price: 1200 },
      { name: 'Rice', quantity: 2, price: 300 },
      { name: 'Naan Bread', quantity: 2, price: 200 }
    ],
    totalAmount: 2000,
    status: 'pending',
    estimatedTime: '20 min'
  },
  {
    table: 'Table 2',
    customerName: 'Jane Smith',
    items: [
      { name: 'Fish & Chips', quantity: 1, price: 1500 },
      { name: 'Salad', quantity: 1, price: 250 },
      { name: 'Lemonade', quantity: 1, price: 200 }
    ],
    totalAmount: 1950,
    status: 'accepted',
    cookingStatus: 'preparing',
    estimatedTime: '15 min'
  },
  {
    table: 'Table 8',
    customerName: 'Mike Johnson',
    items: [
      { name: 'Pasta', quantity: 1, price: 800 },
      { name: 'Garlic Bread', quantity: 2, price: 400 },
      { name: 'Wine', quantity: 1, price: 2000 }
    ],
    totalAmount: 3200,
    status: 'ready',
    estimatedTime: '5 min'
  },
  {
    table: 'Table 3',
    customerName: 'Sarah Wilson',
    items: [
      { name: 'Grilled Salmon', quantity: 1, price: 1800 },
      { name: 'Vegetables', quantity: 1, price: 450 },
      { name: 'Rice', quantity: 1, price: 400 }
    ],
    totalAmount: 2650,
    status: 'accepted',
    cookingStatus: 'preparing',
    estimatedTime: '18 min'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Order.deleteMany({});
    await Inventory.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    // Insert seed data
    const users = await User.insertMany(hashedUsers);
    console.log(`Created ${users.length} users`);

    const inventory = await Inventory.insertMany(seedInventory);
    console.log(`Created ${inventory.length} inventory items`);

    // Add createdBy to orders
    const ordersWithCreator = seedOrders.map(order => ({
      ...order,
      createdBy: users[0]._id
    }));

    const orders = await Order.insertMany(ordersWithCreator);
    console.log(`Created ${orders.length} orders`);

    console.log('\nSeed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: maria@restaurant.com');
    console.log('Password: chef123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();