import { useState } from 'react';
import { Building2, User, Settings, Shield, Menu, X, LogOut, MessageSquarePlus, BookAIcon, BookOpenCheck, MessageCircle, MessageCircleReply, BookPlus, BookTemplateIcon, ListIcon, BookTemplate, FilePlus2Icon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Navigation items
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Building2,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'List Meta Tempalte',
      href: '/templates/library',
      icon: ListIcon,
      current: location.pathname === '/templates/library'
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: FilePlus2Icon,
      current: location.pathname === '/templates'
    },
    {
      name: 'Message',
      href: '/message',
      icon: MessageSquarePlus,
      current: location.pathname === '/message'
    },
    {
      name: 'Chats',
      href: '/chats',
      icon: MessageCircleReply,
      current: location.pathname === '/chats'
    }
  ];

  // Get user role for display
  const getUserRole = () => {
    const privilegesData = localStorage.getItem('userPrivileges');
    if (privilegesData) {
      const privileges = JSON.parse(privilegesData);
      if (privileges?.roleClaimed && privileges.roleClaimed.length > 0) {
        return privileges.roleClaimed[0].name || 'Admin Company';
      }
    }
    return 'Admin Company';
  };

  const getRoleDisplayName = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin-company':
        return 'Company Administrator';
      case 'manager-company':
        return 'Company Manager';
      case 'operator-company':
        return 'Company Operator';
      default:
        return role || 'Administrator';
    }
  };

  const currentRole = getUserRole();

  return (
    <>
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto lg:h-auto lg:shadow-none lg:border-r lg:border-gray-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Company Portal</h2>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                        ${item.current 
                          ? 'bg-emerald-50 text-emerald-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)} // Close mobile sidebar on click
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user}</p>
                <p className="text-xs text-gray-500 truncate">{getRoleDisplayName(currentRole)}</p>
              </div>
            </div>
            
            {/* Logout button in sidebar */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;