import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, User, Mail, Phone, Shield, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { userManagementService } from '../../services/userManagementAPI';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    staffCount: 0,
    customerCount: 0,
    adminCount: 0,
    chefCount: 0,
    waiterCount: 0,
    activeStaff: 0,
    activeCustomers: 0,
    inactiveStaff: 0,
    inactiveCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userManagementService.getAllUsers();
      if (response.success) {
        setUsers(response.data.users);
        // Update stats from the API response
        setUserStats({
          totalUsers: response.data.totalUsers,
          staffCount: response.data.staffCount,
          customerCount: response.data.customerCount,
          adminCount: response.data.adminCount,
          chefCount: response.data.chefCount,
          waiterCount: response.data.waiterCount,
          activeStaff: response.data.users.filter(u => u.userType === 'staff' && u.isActive).length,
          activeCustomers: response.data.users.filter(u => u.userType === 'customer' && u.isActive).length,
          inactiveStaff: response.data.users.filter(u => u.userType === 'staff' && !u.isActive).length,
          inactiveCustomers: response.data.users.filter(u => u.userType === 'customer' && !u.isActive).length
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  // Toggle user status
  const handleToggleStatus = async (userId, userType) => {
    try {
      const response = await userManagementService.toggleUserStatus(userId, userType);
      if (response.success) {
        // Refresh the users list
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError('Failed to update user status.');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userType) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        const response = await userManagementService.deleteUser(userId, userType);
        if (response.success) {
          // Refresh the users list
          await fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user.');
      }
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'admin', name: 'Admin' },
    { id: 'chef', name: 'Chef' },
    { id: 'waiter', name: 'Waiter' },
    { id: 'customer', name: 'Customer' }
  ];

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.fullName || user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const userStatus = user.isActive ? 'active' : 'inactive';
    const matchesStatus = selectedStatus === 'all' || userStatus === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800';
      case 'chef': return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800';
      case 'waiter': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
      case 'customer': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'status-badge success' : 'status-badge error';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'chef': return <UserCheck className="w-4 h-4" />;
      case 'waiter': return <User className="w-4 h-4" />;
      case 'customer': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-600">Manage staff and customer accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Admins</h3>
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{userStats.adminCount}</div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Chefs</h3>
                <UserCheck className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{userStats.chefCount}</div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Waiters</h3>
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{userStats.waiterCount}</div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Customers</h3>
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{userStats.customerCount}</div>
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
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {(user.fullName || user.username || 'U').split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user.fullName || user.username}</div>
                          <div className="text-sm text-gray-500">ID: {user._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-800 flex items-center space-x-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phoneNumber && (
                        <div className="text-sm text-gray-600 flex items-center space-x-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td>
                      <span className={getStatusColor(user.isActive)}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="text-sm text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          className={`transition-colors ${user.isActive ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}`}
                          onClick={() => handleToggleStatus(user._id, user.userType)}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => handleDeleteUser(user._id, user.userType)}
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;