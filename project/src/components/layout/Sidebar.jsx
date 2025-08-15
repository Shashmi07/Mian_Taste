import React from 'react';
import { 
  LayoutDashboard, 
  ChefHat, 
  Package, 
  ShoppingCart, 
  Calendar, 
  Users, 
  BarChart3
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu Management', icon: ChefHat },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'reservations', label: 'Reservations', icon: Calendar },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const Sidebar = ({ activeTab, setActiveTab, collapsed }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        <div className="flex items-center space-x-3">
          <div className="sidebar-logo">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="sidebar-brand">Grand Minato</h1>
              <p className="sidebar-subtitle">Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon className="sidebar-nav-icon" />
              {!collapsed && <span className="sidebar-nav-text">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;