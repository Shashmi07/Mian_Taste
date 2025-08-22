# User Management Backend API Documentation

## Overview

The User Management system handles three types of users:

- **Customers**: Stored in `customer-dashboard` database, collection `user details`
- **Staff (Admin, Chef, Waiter)**: Stored in `Admin-dashboard` database, collection `adminusers`

## Database Structure

### Admin Database (`Admin-dashboard`)

- **Connection**: MongoDB connection for admin/staff users
- **Collection**: `adminusers`
- **Users**: admin, chef, waiter

### Customer Database (`customer-dashboard`)

- **Connection**: Existing customer database connection
- **Collection**: `user details`
- **Users**: customer

## API Endpoints

### Authentication Routes (`/api/admin-auth`)

#### POST `/api/admin-auth/login`

Login for admin/staff users.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "username": "admin",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "admin",
    "phoneNumber": "+1234567890",
    "address": "Admin Address",
    "permissions": {
      "canManageUsers": true,
      "canManageMenu": true,
      "canManageOrders": true,
      "canManageReservations": true,
      "canViewReports": true,
      "canManageInventory": true
    },
    "lastLogin": "2025-08-21T10:30:00.000Z",
    "profileImage": null
  }
}
```

#### POST `/api/admin-auth/create-first-admin`

Create the first admin user (only works if no admin exists).

**Request Body:**

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "fullName": "First Admin",
  "phoneNumber": "+1234567890",
  "address": "Admin Address"
}
```

### User Management Routes (`/api/user-management`)

#### GET `/api/user-management/users`

Get all users (customers + staff).

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "username": "john_doe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "role": "customer",
        "phoneNumber": "+1234567890",
        "address": "User Address",
        "isActive": true,
        "createdAt": "2025-08-21T10:00:00.000Z",
        "updatedAt": "2025-08-21T10:00:00.000Z",
        "userType": "customer"
      },
      {
        "_id": "staff_id",
        "username": "chef_john",
        "email": "chef@example.com",
        "fullName": "Chef John",
        "role": "chef",
        "phoneNumber": "+1234567891",
        "address": "Chef Address",
        "isActive": true,
        "permissions": {
          "canManageUsers": false,
          "canManageMenu": true,
          "canManageOrders": true,
          "canManageReservations": false,
          "canViewReports": false,
          "canManageInventory": true
        },
        "lastLogin": "2025-08-21T09:00:00.000Z",
        "createdAt": "2025-08-21T08:00:00.000Z",
        "updatedAt": "2025-08-21T08:00:00.000Z",
        "userType": "staff"
      }
    ],
    "totalUsers": 2,
    "staffCount": 1,
    "customerCount": 1,
    "adminCount": 0,
    "chefCount": 1,
    "waiterCount": 0
  }
}
```

#### GET `/api/user-management/users/role/:role`

Get users by role (`customer`, `admin`, `chef`, `waiter`).

**Example:** `GET /api/user-management/users/role/chef`

#### GET `/api/user-management/stats`

Get user statistics.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "staffCount": 5,
    "customerCount": 20,
    "adminCount": 1,
    "chefCount": 2,
    "waiterCount": 2,
    "activeStaff": 5,
    "activeCustomers": 18,
    "inactiveStaff": 0,
    "inactiveCustomers": 2
  }
}
```

#### POST `/api/user-management/users`

Create new staff user (admin, chef, waiter).

**Request Body:**

```json
{
  "username": "new_chef",
  "email": "newchef@example.com",
  "password": "password123",
  "fullName": "New Chef",
  "role": "chef",
  "phoneNumber": "+1234567892",
  "address": "Chef Address"
}
```

#### PUT `/api/user-management/users/:id?userType=staff`

Update user. Use query parameter `userType=staff` for staff or `userType=customer` for customers.

**Request Body:**

```json
{
  "fullName": "Updated Name",
  "phoneNumber": "+9876543210",
  "address": "Updated Address"
}
```

#### DELETE `/api/user-management/users/:id?userType=staff`

Soft delete user (set `isActive` to `false`).

#### PATCH `/api/user-management/users/:id/toggle-status?userType=staff`

Toggle user active status.

## User Roles and Permissions

### Admin

- **Permissions**: Full access to all features
  - `canManageUsers: true`
  - `canManageMenu: true`
  - `canManageOrders: true`
  - `canManageReservations: true`
  - `canViewReports: true`
  - `canManageInventory: true`

### Chef

- **Permissions**: Kitchen and menu management
  - `canManageUsers: false`
  - `canManageMenu: true`
  - `canManageOrders: true`
  - `canManageReservations: false`
  - `canViewReports: false`
  - `canManageInventory: true`

### Waiter

- **Permissions**: Front-of-house operations
  - `canManageUsers: false`
  - `canManageMenu: false`
  - `canManageOrders: true`
  - `canManageReservations: true`
  - `canViewReports: false`
  - `canManageInventory: false`

### Customer

- **Permissions**: Limited to customer-facing features
  - No admin permissions
  - Can place orders, make reservations, view menu

## Environment Variables

Add to your `.env` file:

```env
# Existing variables
MONGODB_URI=mongodb://localhost:27017/chef-dashboard
CUSTOMER_MONGO_URI=mongodb://localhost:27017/customer-dashboard

# New variable for admin database
ADMIN_MONGO_URI=mongodb://localhost:27017/Admin-dashboard

# JWT Secret
JWT_SECRET=your-very-secure-secret-key-here
```

## Getting Started

1. **Set up environment variables** in your `.env` file
2. **Start the server**: The admin database will be created automatically
3. **Create first admin**:
   ```bash
   POST /api/admin-auth/create-first-admin
   ```
4. **Login as admin** to create other staff members
5. **Use user management endpoints** to manage all users

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

## Security Features

- **Password Hashing**: Using bcryptjs with salt rounds of 12
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **Role-based Permissions**: Granular permission system
- **Soft Deletes**: Users are deactivated, not permanently deleted
- **Database Separation**: Different databases for different user types

## Testing the API

You can test the API using tools like Postman or curl:

1. **Create first admin**:

   ```bash
   curl -X POST http://localhost:5000/api/admin-auth/create-first-admin \
   -H "Content-Type: application/json" \
   -d '{"username":"admin","email":"admin@test.com","password":"admin123","fullName":"Admin User","phoneNumber":"+1234567890"}'
   ```

2. **Login**:

   ```bash
   curl -X POST http://localhost:5000/api/admin-auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"admin@test.com","password":"admin123"}'
   ```

3. **Get all users**:
   ```bash
   curl -X GET http://localhost:5000/api/user-management/users
   ```
