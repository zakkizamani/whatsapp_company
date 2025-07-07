import { useState } from 'react';
import { Building2, LogOut, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import useAuth from '../hooks/useAuth.js';

const Layout = ({ children, title = "Dashboard" }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 w-full relative z-30">
        <div className="flex items-center justify-between px-4 py-3 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Company Portal</h1>
                <p className="text-sm text-gray-500">WhatsApp Business</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user}</p>
              <p className="text-xs text-gray-500">{getRoleDisplayName(currentRole)}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex w-full">
        {/* Sidebar Component */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gray-50 w-full">
          <div className="p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;