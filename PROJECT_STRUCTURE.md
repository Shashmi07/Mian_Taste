# Mian Taste Restaurant Management System

## Project Architecture Overview

This is a full-stack restaurant management system built with Node.js/Express backend and React frontend, supporting customer ordering, table reservations, admin dashboard, and chef operations.

### Technology Stack

**Backend:**
- Node.js with Express.js
- MongoDB (3 separate databases)
- Socket.io for real-time communication
- JWT for authentication
- Nodemailer for email services

**Frontend:**
- React 19.1.1
- React Router DOM for navigation
- Tailwind CSS for styling
- Context API for state management
- Formik & Yup for form validation

## Project Structure

```
Mian_Taste/
├── backend/                          # Node.js/Express API Server
│   ├── config/                       # Database configurations
│   │   ├── database.js              # Chef database connection
│   │   ├── customerDatabase.js      # Customer database connection
│   │   └── adminDatabase.js         # Admin database connection
│   ├── controllers/                  # Business logic controllers
│   │   ├── authController.js        # Chef authentication
│   │   ├── customerController.js    # Customer authentication & management
│   │   ├── adminAuthController.js   # Admin authentication
│   │   ├── orderController.js       # Regular orders
│   │   ├── qrOrderController.js     # QR-based orders
│   │   ├── preOrderController.js    # Pre-orders
│   │   ├── menuController.js        # Menu management
│   │   ├── inventoryController.js   # Basic inventory
│   │   ├── adminInventoryController.js # Admin inventory management
│   │   ├── tableReservationController.js # Table reservations
│   │   ├── feedbackController.js    # Customer feedback
│   │   └── userManagementController.js # User management
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                  # Chef users
│   │   ├── Customer.js              # Customer users
│   │   ├── AdminUser.js             # Admin users
│   │   ├── Order.js                 # Regular orders
│   │   ├── QrOrder.js               # QR orders
│   │   ├── PreOrder.js              # Pre-orders
│   │   ├── MenuItem.js              # Menu items
│   │   ├── Inventory.js             # Inventory items
│   │   ├── TableReservation.js      # Table reservations
│   │   └── Feedback.js              # Customer feedback
│   ├── routes/                      # API route definitions
│   │   ├── auth.js                  # Chef auth routes
│   │   ├── customerRoutes.js        # Customer routes
│   │   ├── adminAuth.js             # Admin auth routes
│   │   ├── orders.js                # Order routes
│   │   ├── qrOrders.js              # QR order routes
│   │   ├── preOrders.js             # Pre-order routes
│   │   ├── menuRoutes.js            # Menu routes
│   │   ├── inventory.js             # Inventory routes
│   │   ├── adminInventory.js        # Admin inventory routes
│   │   ├── tableReservationRoutes.js # Table reservation routes
│   │   ├── feedback.js              # Feedback routes
│   │   ├── adminFeedback.js         # Admin feedback routes
│   │   ├── userManagement.js        # User management routes
│   │   ├── adminAnalytics.js        # Analytics routes
│   │   └── testEmail.js             # Email testing
│   ├── middleware/                  # Custom middleware
│   │   ├── auth.js                  # Authentication middleware
│   │   └── errorHandler.js          # Error handling middleware
│   ├── services/                    # Business logic services
│   │   └── emailService.js          # Email service
│   ├── utils/                       # Utility functions
│   ├── scripts/                     # Database seeding scripts
│   ├── socket/                      # Socket.io handlers
│   └── server.js                    # Main server file
│
└── restaurant-frontend/             # React Application
    ├── public/                      # Static assets
    ├── src/
    │   ├── components/              # Reusable components
    │   │   ├── Login.jsx            # Customer login component
    │   │   ├── AdminLogin.jsx       # Admin login component
    │   │   ├── NavBar.jsx           # Navigation bar
    │   │   ├── footer.jsx           # Footer component
    │   │   ├── MenuCategory.jsx     # Menu category component
    │   │   ├── OrderCard.jsx        # Order display component
    │   │   ├── ScrollToTop.jsx      # Scroll utility
    │   │   └── NotificationDropdown.jsx # Notifications
    │   ├── context/                 # React Context providers
    │   │   ├── CartContext.jsx      # Shopping cart state
    │   │   └── NotificationContext.js # Notifications state
    │   ├── pages/                   # Page components
    │   │   ├── Homepage.jsx         # Landing page
    │   │   ├── AboutUs.jsx          # About us page
    │   │   ├── LoginScreen.jsx      # Customer login page
    │   │   ├── SignupScreen.jsx     # Customer signup page
    │   │   ├── Menu.jsx             # Main menu page
    │   │   ├── menu/                # Menu category pages
    │   │   │   ├── Ramen.jsx        # Ramen category
    │   │   │   ├── Rice.jsx         # Rice category
    │   │   │   ├── Soup.jsx         # Soup category
    │   │   │   ├── Drink.jsx        # Drinks category
    │   │   │   └── More.jsx         # Other items
    │   │   ├── Cart.jsx             # Shopping cart
    │   │   ├── PreOrder.jsx         # Pre-order page
    │   │   ├── TableReservation.jsx # Table booking
    │   │   ├── PaymentGateway.jsx   # Payment processing
    │   │   ├── LiveTracking.jsx     # Order tracking
    │   │   ├── FeedbackPage.jsx     # Customer feedback
    │   │   ├── ChefDashboard.jsx    # Chef operations
    │   │   ├── AdminDashboard/      # Admin panel pages
    │   │   │   ├── AdminDashboard.jsx # Main admin layout
    │   │   │   ├── Dashboard.jsx    # Analytics dashboard
    │   │   │   ├── OrderManagement.jsx # Order management
    │   │   │   ├── MenuManagement.jsx # Menu management
    │   │   │   ├── InventoryManagement.jsx # Inventory
    │   │   │   ├── UserManagement.jsx # User management
    │   │   │   ├── FeedbackManagement.jsx # Feedback management
    │   │   │   ├── PreOrderManagement.jsx # Pre-order management
    │   │   │   ├── QrOrderManagement.jsx # QR order management
    │   │   │   ├── TableReservation.jsx # Reservation management
    │   │   │   └── QRGenerator.jsx  # QR code generation
    │   │   └── ui/                  # UI components
    │   │       ├── Chart.jsx        # Chart components
    │   │       └── StatCard.jsx     # Statistics cards
    │   ├── App.js                   # Main app component
    │   └── index.js                 # App entry point
    └── package.json                 # Frontend dependencies
```

## Frontend Pages → Backend API Mapping

### Customer-Facing Pages

| Frontend Page | Backend Route | Controller | Purpose |
|---------------|---------------|------------|---------|
| `Homepage.jsx` | `/api/menu` | `menuController.js` | Display featured items |
| `Menu.jsx` + categories | `/api/menu` | `menuController.js` | Menu browsing |
| `LoginScreen.jsx` | `/api/customers/login` | `customerController.js` | Customer login |
| `SignupScreen.jsx` | `/api/customers/register` | `customerController.js` | Customer registration |
| `Cart.jsx` | `/api/orders/public` | `orderController.js` | Place orders |
| `PreOrder.jsx` | `/api/pre-orders` | `preOrderController.js` | Pre-order meals |
| `TableReservation.jsx` | `/api/table-reservations` | `tableReservationController.js` | Book tables |
| `FeedbackPage.jsx` | `/api/feedback` | `feedbackController.js` | Submit feedback |
| `LiveTracking.jsx` | `/api/orders/track/:id` | `orderController.js` | Track orders |

### Admin Dashboard Pages

| Frontend Page | Backend Route | Controller | Purpose |
|---------------|---------------|------------|---------|
| `AdminDashboard.jsx` | `/api/admin-auth/login` | `adminAuthController.js` | Admin login |
| `Dashboard.jsx` | `/api/admin-analytics/powerbi-data` | `adminAnalytics.js` | Analytics |
| `OrderManagement.jsx` | `/api/orders`, `/api/qr-orders`, `/api/pre-orders` | Multiple | Manage all orders |
| `MenuManagement.jsx` | `/api/menu` | `menuController.js` | CRUD menu items |
| `InventoryManagement.jsx` | `/api/admin-inventory` | `adminInventoryController.js` | Manage inventory |
| `UserManagement.jsx` | `/api/user-management/users` | `userManagementController.js` | Manage users |
| `FeedbackManagement.jsx` | `/api/admin-feedback` | `adminFeedback.js` | View feedback |

### Chef Dashboard

| Frontend Page | Backend Route | Controller | Purpose |
|---------------|---------------|------------|---------|
| `ChefDashboard.jsx` | `/api/auth/login`, `/api/orders` | `authController.js`, `orderController.js` | Kitchen operations |

## Database Architecture

### Database 1: Chef Operations
- Users (Chef accounts)
- Orders (Regular orders)
- Menu Items
- Inventory

### Database 2: Customer Management  
- Customers
- Table Reservations
- QR Orders
- Pre-Orders

### Database 3: Admin & Analytics
- Admin Users
- Feedback
- Analytics Data
- User Management

## Authentication Flow

1. **Customer Auth**: JWT tokens stored in localStorage as `customerToken`
2. **Admin Auth**: JWT tokens stored in localStorage as `token` 
3. **Chef Auth**: JWT tokens stored in localStorage as `token`

## Real-time Features (Socket.io)

- Order status updates
- Kitchen notifications
- Live order tracking
- Real-time inventory updates

## Key Features

- **Multi-role Authentication**: Customers, Chefs, Admins
- **Order Management**: Regular, Pre-orders, QR-based ordering
- **Table Reservations**: Real-time availability checking
- **Inventory Management**: Stock tracking and alerts
- **Analytics Dashboard**: Business intelligence and reporting
- **Feedback System**: Customer satisfaction tracking
- **Payment Integration**: Payment gateway support
- **Mobile Responsive**: Tailwind CSS responsive design

## Development Setup

1. **Backend**: `cd backend && npm install && npm run dev`
2. **Frontend**: `cd restaurant-frontend && npm install && npm start`
3. **Environment**: Configure `.env` file in backend directory
4. **Databases**: Ensure MongoDB connections are configured

## API Base URLs

- Development: `http://localhost:8000`
- Local Network: `http://10.11.5.232:8000` / `http://192.168.8.209:8000`

---

*This documentation provides a comprehensive overview of the Mian Taste Restaurant Management System architecture and component relationships.*