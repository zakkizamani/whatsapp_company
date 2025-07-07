import { useState, useEffect } from 'react';
import { Building2, User, Settings, Shield } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import useAuth from '../hooks/useAuth.js';
import { CONFIG } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const [userPrivileges, setUserPrivileges] = useState(null);
  const [userAccount, setUserAccount] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const privilegesData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_PRIVILEGES);
    const accountData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ACCOUNT);
    
    if (privilegesData) {
      setUserPrivileges(JSON.parse(privilegesData));
    }
    if (accountData) {
      setUserAccount(JSON.parse(accountData));
    }
  }, []);

  const getUserRole = () => {
    if (userPrivileges?.roleClaimed && userPrivileges.roleClaimed.length > 0) {
      return userPrivileges.roleClaimed[0].name || 'Admin Company';
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
    <Layout title="Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Selamat Datang, {user}!
        </h1>
        <p className="text-gray-600">
          Anda masuk sebagai <span className="font-medium text-emerald-600">{getRoleDisplayName(currentRole)}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pengguna</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12% dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pesan Aktif</p>
              <p className="text-2xl font-bold text-gray-900">5,678</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+8% dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Koneksi Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">890</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+5% dari kemarin</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status Server</p>
              <p className="text-2xl font-bold text-green-600">Online</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Uptime: 99.9%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <User className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">Tambah Pengguna</span>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">Kelola Pengaturan</span>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">Audit Keamanan</span>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">Lihat Laporan</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Pengguna baru terdaftar</p>
              <p className="text-xs text-gray-500">2 menit yang lalu</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Sistem diperbarui</p>
              <p className="text-xs text-gray-500">1 jam yang lalu</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Backup otomatis selesai</p>
              <p className="text-xs text-gray-500">3 jam yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;