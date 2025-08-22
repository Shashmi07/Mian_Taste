const { connectAdminDB, getAdminConnection } = require('./config/adminDatabase');
const { connectCustomerDB, getCustomerConnection } = require('./config/customerDatabase');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const AdminUserSchema = require('./models/AdminUser').schema;

async function createTestData() {
  try {
    // Connect to databases first
    console.log('Connecting to databases...');
    await connectAdminDB();
    await connectCustomerDB();
    
    // Get models
    const adminConn = getAdminConnection();
    const customerConn = getCustomerConnection();
    
    const AdminUser = adminConn.model('AdminUser', AdminUserSchema);
    
    // Create customer schema and model
    const customerSchema = new require('mongoose').Schema({
      username: String,
      email: String,
      fullName: String,
      phoneNumber: String,
      address: String,
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    let Customer;
    try {
      Customer = customerConn.model('user details');
    } catch (error) {
      Customer = customerConn.model('user details', customerSchema);
    }

    // Create sample admin users
    const adminUsers = [
      {
        username: 'admin',
        email: 'admin@restaurant.com',
        password: await bcrypt.hash('admin123', 10),
        fullName: 'Restaurant Admin',
        role: 'admin',
        phoneNumber: '+1234567890',
        address: '123 Admin Street',
        isActive: true
      },
      {
        username: 'chef1',
        email: 'chef@restaurant.com',
        password: await bcrypt.hash('chef123', 10),
        fullName: 'Head Chef',
        role: 'chef',
        phoneNumber: '+1234567891',
        address: '124 Chef Avenue',
        isActive: true
      },
      {
        username: 'waiter1',
        email: 'waiter@restaurant.com',
        password: await bcrypt.hash('waiter123', 10),
        fullName: 'Senior Waiter',
        role: 'waiter',
        phoneNumber: '+1234567892',
        address: '125 Service Lane',
        isActive: true
      }
    ];

    // Create sample customers
    const customers = [
      {
        username: 'customer1',
        email: 'john@customer.com',
        fullName: 'John Doe',
        phoneNumber: '+1234567893',
        address: '126 Customer Street',
        isActive: true
      },
      {
        username: 'customer2',
        email: 'jane@customer.com',
        fullName: 'Jane Smith',
        phoneNumber: '+1234567894',
        address: '127 Customer Avenue',
        isActive: true
      },
      {
        username: 'customer3',
        email: 'mike@customer.com',
        fullName: 'Mike Johnson',
        phoneNumber: '+1234567895',
        address: '128 Customer Boulevard',
        isActive: false
      }
    ];

    // Insert admin users
    console.log('Creating admin users...');
    for (const userData of adminUsers) {
      const existingUser = await AdminUser.findOne({ 
        $or: [{ email: userData.email }, { username: userData.username }] 
      });
      
      if (!existingUser) {
        const user = new AdminUser(userData);
        await user.save();
        console.log(`Created ${userData.role}: ${userData.username}`);
      } else {
        console.log(`${userData.role} already exists: ${userData.username}`);
      }
    }

    // Insert customers
    console.log('Creating customers...');
    for (const customerData of customers) {
      const existingCustomer = await Customer.findOne({ 
        $or: [{ email: customerData.email }, { username: customerData.username }] 
      });
      
      if (!existingCustomer) {
        const customer = new Customer(customerData);
        await customer.save();
        console.log(`Created customer: ${customerData.username}`);
      } else {
        console.log(`Customer already exists: ${customerData.username}`);
      }
    }

    console.log('Test data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

createTestData();
