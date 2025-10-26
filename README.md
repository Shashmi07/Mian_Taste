# 🍽️ Mian_Taste - Smart Restaurant Management System

A modern, full-stack intelligent restaurant management platform designed to streamline restaurant operations — from real-time order tracking to kitchen management, table reservations, and comprehensive analytics. 🚀

Built specifically for **Grand Minato Restaurant**, Kottawa to enable seamless dining experiences with real-time synchronization across all modules.

## ✨ Features

### � **Customer Features**
- **QR Code Ordering**: Scan table QR codes to place orders directly from your table
- **Real-time Order Tracking**: Live order status updates and notifications
- **Table Reservations**: Book tables in advance with ease
- **Digital Menu**: Comprehensive menu with categories, descriptions, and images
- **Order History**: Access previous orders and reorder with one click

### 👨‍💼 **Admin & Management Features**
- **Analytics Dashboard**: Real-time revenue tracking, order distribution analysis, and business insights
- **Kitchen Management**: Real-time order notifications and kitchen synchronization
- **Inventory Management**: Track stock levels and manage inventory efficiently
- **Menu Management**: Dynamic menu customization with categories and pricing
- **User Management**: Multi-role access control (Admin, Chef, Staff, Customer)
- **Pre-Orders**: Schedule and manage advance orders
- **Feedback Management**: Collect and analyze customer feedback
- **Cross-Platform Access**: Manage operations from any device with responsive design

### 🍳 **Kitchen Operations**
- Real-time order notification system
- Live order status updates for kitchen staff
- Priority-based order management
- Order history and analytics

### 💳 **Order & Payment Management**
- Online order placement and tracking
- Multiple payment options support
- Real-time order notifications
- Order history and reorder functionality

### 📊 **Analytics & Reports**
- Revenue tracking and forecasting
- Order distribution analysis
- Customer feedback insights
- Performance metrics and KPIs

## 🛠️ Tech Stack

### **Frontend**
- React.js - UI framework
- Tailwind CSS - Styling and responsive design
- Recharts.js - Data visualization and analytics
- Socket.io Client - Real-time communication
- Axios - HTTP client for API requests

### **Backend**
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - NoSQL database
- Socket.io - WebSocket communication for real-time updates
- JWT - Authentication and authorization

### **Infrastructure & Deployment**
- AWS (EC2, S3, CloudFront) - Cloud hosting and CDN
- Environment Variables - Configuration management
- Git - Version control

## 🏗️ System Architecture

```
┌─────────────────┐
│  QR Ordering    │
│  Reservations   │
│  Order Tracking │
└────────┬────────┘
         │ React.js + Socket.io
         │
    ┌────▼─────┐
    │ Frontend  │
    │ App       │
    └────┬─────┘
         │ REST API
         │
    ┌────▼──────────┐
    │ Node.js       │
    │ Express       │
    │ Backend       │
    └────┬──────────┘
         │
    ┌────▼─────┐
    │ MongoDB   │
    │ Database  │
    └──────────┘
```

## � Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Shashmi07/Mian_Taste.git
cd Mian_Taste
```

2. **Backend Setup:**
```bash
cd backend
npm install
# Create .env file with configuration
npm start
```

3. **Frontend Setup:**
```bash
cd restaurant-frontend
npm install
npm start
```

Open `http://localhost:3000` in your browser to view the application.

## 📁 Project Structure

```
Mian_Taste/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Request handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── server.js       # Entry point
│
├── restaurant-frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Context API
│   │   └── config/     # API config
│   └── package.json
│
└── README.md
```

## 🎯 Key Features Implemented

✅ Real-time order tracking with Socket.io  
✅ QR code table ordering system  
✅ Multi-role authentication (Admin, Chef, Customer)  
✅ Dynamic menu management  
✅ Inventory tracking and management  
✅ Analytics dashboard with Recharts  
✅ Table reservation system  
✅ Customer feedback management  
✅ Responsive design for all devices  
✅ AWS cloud deployment  

## 🌐 Deployment

The application is deployed on AWS with:
- **Backend**: Node.js server
- **Frontend**: React application
- **Database**: MongoDB
- **Real-time**: Socket.io integration
- **CDN**: AWS CloudFront

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed instructions.

## � Documentation

- [API Documentation](./backend/USER_MANAGEMENT_API.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)

## 👥 About

**Built for**: Grand Minato Restaurant, Kottawa

**Repository**: [github.com/Shashmi07/Mian_Taste](https://github.com/Shashmi07/Mian_Taste)

---

**Last Updated**: October 26, 2025
