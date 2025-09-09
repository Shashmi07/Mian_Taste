import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Menu, 
  ShoppingCart, 
  Users, 
  Calendar,
  Package,
  LogOut,
  X,
  MenuIcon,
  Settings as SettingsIcon,
  QrCode,
  MessageSquare
} from 'lucide-react';

// Import dashboard components
import Dashboard from './Dashboard';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import QrOrderManagement from './QrOrderManagement';
import PreOrderManagement from './PreOrderManagement';
import UserManagement from './UserManagement';
import TableReservation from './TableReservation';
import InventoryManagement from './InventoryManagement';
import FeedbackManagement from './FeedbackManagement';

import QRGenerator from './QRGenerator';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', name: 'Menu Management', icon: Menu },
    { id: 'qr-orders', name: 'QR Orders', icon: ShoppingCart },
    { id: 'pre-orders', name: 'Pre-Orders', icon: Calendar },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'reservations', name: 'Table Reservations', icon: Calendar },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'feedback', name: 'Customer Feedback', icon: MessageSquare },
    { id: 'qr-generator', name: 'QR Code Generator', icon: QrCode },
 
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'menu':
        return <MenuManagement />;
      case 'qr-orders':
        return <QrOrderManagement />;
      case 'pre-orders':
        return <PreOrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'reservations':
        return <TableReservation />;
      case 'inventory':
        return <InventoryManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'qr-generator':
        return <QRGenerator />;
     
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-red-200">
          <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 pb-4">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors
                    ${activeTab === item.id
                      ? 'bg-red-100 text-red-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-red-600 shadow-sm border-b border-red-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-red-100 hover:text-white mr-4"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Admin info */}
              <div className="flex items-center gap-2 bg-red-600 bg-opacity-20 backdrop-blur-sm px-4 py-2 border border-red-400 border-opacity-50" style={{borderRadius: '25px'}}>
                <div className="w-7 h-7 bg-red-500 flex items-center justify-center text-white font-medium text-sm" style={{borderRadius: '50%'}}>
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{(user?.username || 'Admin').split(' ')[0]}</p>
                  <p className="text-xs text-red-200">Admin</p>
                </div>
              </div>
              
              {/* Logout button */}
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-red-100 hover:text-white hover:bg-red-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
