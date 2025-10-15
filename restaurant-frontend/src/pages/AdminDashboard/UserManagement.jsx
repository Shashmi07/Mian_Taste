import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, User, Mail, Phone, Shield, UserCheck, RefreshCw, AlertCircle, X, Eye } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userManagementService } from '../../services/userManagementAPI';
import { addUserSchema } from '../../utils/validation';

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
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'waiter',
    phoneNumber: '',
    address: ''
  });

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
      setError(null);
      const response = await userManagementService.toggleUserStatus(userId, userType);
      if (response.success) {
        // Show success message
        const action = response.message.includes('activated') ? 'activated' : 'deactivated';
        alert(`✅ Success!\n\nUser has been ${action} successfully.`);
        
        // Refresh the users list
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user status. Please try again.';
      setError(errorMessage);
      alert(`❌ Error\n\n${errorMessage}`);
    }
  };

  // Delete user (soft delete - deactivate)
  const handleDeleteUser = async (userId, userType) => {
    // Find the user to get their name for confirmation
    const user = users.find(u => u._id === userId);
    const userName = user ? (user.fullName || user.username) : 'this user';
    
    if (window.confirm(`⚠️ Confirm Deactivation\n\nAre you sure you want to deactivate ${userName}?\nThis will set their status to inactive.`)) {
      try {
        setError(null);
        const response = await userManagementService.deleteUser(userId, userType);
        if (response.success) {
          // Show success message
          alert(`✅ User Deactivated\n\n${userName} has been deactivated successfully.`);
          
          // Refresh the users list
          await fetchUsers();
        }
      } catch (error) {
        console.error('Error deactivating user:', error);
        const errorMessage = error.response?.data?.message || 'Failed to deactivate user. Please try again.';
        setError(errorMessage);
        alert(`❌ Error\n\n${errorMessage}`);
      }
    }
  };

  // Handle add user form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: 'waiter',
      phoneNumber: '',
      address: ''
    });
    setError(null);
  };

  // Handle add user submission
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.username || !formData.email || !formData.password || 
          !formData.fullName || !formData.phoneNumber) {
        setError('All required fields must be filled out.');
        return;
      }

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      const response = await userManagementService.createStaffUser(formData);
      
      if (response.success) {
        // Success - close modal and refresh users
        setShowAddUserModal(false);
        resetForm();
        await fetchUsers();
        // Show success message briefly
        setError(null);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to add user. Please try again.');
      }
    } finally {
      setAddUserLoading(false);
    }
  };

  // Handle opening add user modal
  const handleOpenAddUserModal = () => {
    resetForm();
    setShowAddUserModal(true);
  };

  // Handle opening view user modal
  const handleOpenViewUserModal = (user) => {
    setViewingUser(user);
    setShowViewUserModal(true);
  };

  // Handle closing view user modal
  const handleCloseViewUserModal = () => {
    setViewingUser(null);
    setShowViewUserModal(false);
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
          <button 
            onClick={handleOpenAddUserModal}
            className="btn-primary flex items-center space-x-2"
          >
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

          {/* Scrollable table wrapper */}
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Join Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Login</th>
                      <th scope="col" className="px-3 py-3.5 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6 sticky right-0 bg-gray-50">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-xs">
                            {(user.fullName || user.username || 'U').split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">{user.fullName || user.username}</div>
                          <div className="text-xs text-gray-500 truncate">ID: {user._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="text-gray-900 flex items-center space-x-1 mb-1">
                        <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{user.email}</span>
                      </div>
                      {user.phoneNumber && (
                        <div className="text-gray-600 flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={getStatusColor(user.isActive)}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6 sticky right-0 bg-white shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
                      <div className="flex space-x-1 justify-end">
                        <button 
                          onClick={() => handleOpenViewUserModal(user)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 hover:bg-indigo-50 rounded"
                          title="View user details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
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
            </div>
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New User</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
                fullName: '',
                role: 'waiter',
                phoneNumber: '',
                address: ''
              }}
              validationSchema={addUserSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setAddUserLoading(true);
                  setError(null);
                  
                  const response = await userManagementService.createStaffUser(values);
                  
                  if (response.success) {
                    await fetchUsers();
                    setShowAddUserModal(false);
                  } else {
                    throw new Error(response.message || 'Failed to add user');
                  }
                } catch (err) {
                  console.error('Add user error:', err);
                  setError(err.message || 'Failed to add user. Please try again.');
                } finally {
                  setAddUserLoading(false);
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="fullName"
                      type="text"
                      placeholder="Enter full name"
                      className={`form-input w-full ${
                        errors.fullName && touched.fullName ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      className={`form-input w-full ${
                        errors.username && touched.username ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      className={`form-input w-full ${
                        errors.email && touched.email ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Enter password (min. 8 characters)"
                      className={`form-input w-full ${
                        errors.password && touched.password ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="role"
                      as="select"
                      className={`form-select w-full ${
                        errors.role && touched.role ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="admin">Admin</option>
                      <option value="chef">Chef</option>
                      <option value="waiter">Waiter</option>
                    </Field>
                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number (e.g., +1234567890 or 0771234567)"
                      className={`form-input w-full ${
                        errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Field
                      name="address"
                      as="textarea"
                      placeholder="Enter address (optional)"
                      rows={2}
                      className={`form-input w-full ${
                        errors.address && touched.address ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addUserLoading}
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      {addUserLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add User</span>
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {showViewUserModal && viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <User className="w-7 h-7 text-indigo-600" />
                <span>User Details</span>
              </h2>
              <button
                onClick={handleCloseViewUserModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {(viewingUser.fullName || viewingUser.username || 'U').split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {viewingUser.fullName || viewingUser.username}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(viewingUser.role)}`}>
                      {getRoleIcon(viewingUser.role)}
                      <span className="capitalize">{viewingUser.role}</span>
                    </span>
                    <span className={getStatusColor(viewingUser.isActive)}>
                      {viewingUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    <span>Basic Information</span>
                  </h4>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-gray-800 font-medium">{viewingUser.username || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-800 font-medium">{viewingUser.fullName || viewingUser.username || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-gray-800 font-mono text-sm">{viewingUser._id}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">User Type</label>
                    <p className="text-gray-800 font-medium capitalize">{viewingUser.userType || 'N/A'}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <span>Contact Information</span>
                  </h4>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-800 font-medium break-all">{viewingUser.email || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-800 font-medium">{viewingUser.phoneNumber || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-800">{viewingUser.address || 'Not provided'}</p>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <span>Account Information</span>
                  </h4>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Join Date</label>
                    <p className="text-gray-800 font-medium">
                      {viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-800 font-medium">
                      {viewingUser.updatedAt ? new Date(viewingUser.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <p className="text-gray-800 font-medium">
                      {viewingUser.lastLogin ? (
                        <>
                          {new Date(viewingUser.lastLogin).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          <span className="text-sm text-gray-500 ml-2">
                            at {new Date(viewingUser.lastLogin).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Never logged in</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        viewingUser.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {viewingUser.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Permissions (for staff only) */}
                {viewingUser.userType === 'staff' && viewingUser.permissions && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <span>Permissions</span>
                    </h4>

                    <div className="space-y-2">
                      {Object.entries(viewingUser.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={`text-sm font-medium ${value ? 'text-green-600' : 'text-red-600'}`}>
                            {value ? '✓ Allowed' : '✗ Denied'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Specific Info */}
                {viewingUser.userType === 'customer' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700">Customer Information</h4>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Orders</label>
                      <p className="text-gray-800 font-medium text-2xl">{viewingUser.orderCount || 0}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleCloseViewUserModal}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;