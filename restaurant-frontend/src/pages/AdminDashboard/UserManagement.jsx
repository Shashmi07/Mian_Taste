import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, User, Mail, Phone, Shield, UserCheck } from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [users] = useState([
    {
      id: '1',
      name: 'Rajesh Admin',
      email: 'rajesh@grandminato.com',
      phone: '+91 98765 43210',
      role: 'admin',
      status: 'active',
      joinDate: '2023-01-15',
      lastLogin: '2 hours ago'
    },
    {
      id: '2',
      name: 'Priya Manager',
      email: 'priya@grandminato.com',
      phone: '+91 87654 32109',
      role: 'manager',
      status: 'active',
      joinDate: '2023-02-20',
      lastLogin: '1 day ago'
    },
    {
      id: '3',
      name: 'Arjun Chef',
      email: 'arjun@grandminato.com',
      phone: '+91 76543 21098',
      role: 'staff',
      status: 'active',
      joinDate: '2023-03-10',
      lastLogin: '3 hours ago'
    },
    {
      id: '4',
      name: 'Kavya Waiter',
      email: 'kavya@grandminato.com',
      phone: '+91 65432 10987',
      role: 'staff',
      status: 'inactive',
      joinDate: '2023-04-05',
      lastLogin: '1 week ago'
    },
    {
      id: '5',
      name: 'Vikram Customer',
      email: 'vikram@email.com',
      phone: '+91 54321 09876',
      role: 'customer',
      status: 'active',
      joinDate: '2023-05-12',
      lastLogin: '5 hours ago'
    }
  ]);

  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'admin', name: 'Admin' },
    { id: 'manager', name: 'Manager' },
    { id: 'staff', name: 'Staff' },
    { id: 'customer', name: 'Customer' }
  ];

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800';
      case 'manager': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
      case 'staff': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
      case 'customer': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-badge success';
      case 'inactive': return 'status-badge error';
      default: return 'status-badge info';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'manager': return <UserCheck className="w-4 h-4" />;
      case 'staff': return <User className="w-4 h-4" />;
      case 'customer': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    manager: users.filter(u => u.role === 'manager').length,
    staff: users.filter(u => u.role === 'staff').length,
    customer: users.filter(u => u.role === 'customer').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-600">Manage staff and customer accounts</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Admins</h3>
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{roleStats.admin}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Managers</h3>
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{roleStats.manager}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Staff</h3>
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{roleStats.staff}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Customers</h3>
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{roleStats.customer}</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full sm:w-80"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-select"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
            >
              {statuses.map(status => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="data-table">
          <table className="w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-800 flex items-center space-x-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td>
                    <span className={getStatusColor(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="text-sm text-gray-600">
                    {user.lastLogin}
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;