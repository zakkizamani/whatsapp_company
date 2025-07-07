import { useState, useEffect } from 'react';
import { Eye, EyeOff, Building2, Shield, Lock, User, Mail } from 'lucide-react';
import useToast from '../hooks/useToast.js';
import useAuth from '../hooks/useAuth.js';
import ToastContainer from '../components/ToastContainer.jsx';
import { authService } from '../services/authService.js';
import { CONFIG } from '../utils/constants';
import { authUtils } from '../utils/authUtils.js';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Load remembered credentials
  useEffect(() => {
    const rememberedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.REMEMBERED_USER);
    const rememberedPassword = localStorage.getItem(CONFIG.STORAGE_KEYS.REMEMBERED_PASSWORD);
    
    if (rememberedUser && rememberedPassword) {
      setFormData(prev => ({
        ...prev,
        username: rememberedUser,
        password: rememberedPassword,
        rememberMe: true
      }));
    }

    // Keep the important logic from original
    if(!rememberedUser || !rememberedPassword) {
      navigate('/login', { replace: true });      
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      showToast('Username atau email harus diisi', 'error');
      return false;
    }
    
    if (!formData.password) {
      showToast('Password harus diisi', 'error');
      return false;
    }

    if (formData.username.length < CONFIG.VALIDATION.MIN_USERNAME_LENGTH) {
      showToast(`Username minimal ${CONFIG.VALIDATION.MIN_USERNAME_LENGTH} karakter`, 'error');
      return false;
    }

    if (formData.password.length < CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
      showToast(`Password minimal ${CONFIG.VALIDATION.MIN_PASSWORD_LENGTH} karakter`, 'error');
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Company Login
      const loginData = await authService.login(formData.username, formData.password);
      
      const token = loginData.data.access_token;
      
      // Step 2: Get company user privileges
      const privilegesData = await authService.getPrivileges(token);
      
      // Step 3: Validate company user role BEFORE proceeding
      const roleValidation = authUtils.validateUserRole(privilegesData.data.roleClaimed);
      
      if (!roleValidation.isValid) {
        // Clear any stored auth data
        authUtils.clearAuthData();
        
        showToast(roleValidation.message, 'error');
        console.warn('Access denied for company user roles:', roleValidation.userRoles);
        return;
      }
      
      // Step 4: Get company user account information
      const userAccountData = await authService.getUserAccount(token);

      // Step 5: Store company data in localStorage
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER_PRIVILEGES, JSON.stringify(privilegesData.data));
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ACCOUNT, JSON.stringify(userAccountData.data));

      // Use the auth hook to handle login
      login(
        { username: formData.username, password: formData.password },
        token,
        loginData.data.expires_in,
        formData.rememberMe
      );

      showToast(`Selamat datang di Company Portal! Role: ${roleValidation.userRoles.join(', ')}`, 'success');
      
      // Navigate to company dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error('Company login error:', err);
      
      // Clear any partially stored auth data on error
      authUtils.clearAuthData();
      
      showToast(err.message || 'Terjadi kesalahan saat login ke company portal', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showToast('Fitur lupa password akan segera tersedia', 'info');
  };

  const handleContactAdmin = () => {
    showToast('Silakan hubungi administrator melalui email atau telepon kantor', 'info');
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 fixed inset-0">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="w-full max-w-md">
        {/* Header Section - Company Theme */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4 shadow-xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">WhatsApp Company Portal</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            Portal Perusahaan
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-start block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {formData.username.includes('@') ? (
                    <Mail className="w-5 h-5 text-gray-400" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Masukkan username atau email"
                  disabled={isLoading}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-start block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Masukkan password"
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
                disabled={isLoading}
              >
                Lupa password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-emerald-300 disabled:to-green-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Masuk ke Portal...
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  Masuk ke Portal
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau</span>
              </div>
            </div>

            {/* Company Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Tidak punya akses company?
              </p>
              <button
                type="button"
                onClick={handleContactAdmin}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                disabled={isLoading}
              >
                Hubungi Administrator
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500 space-y-1">
          <p>© 2025 WhatsApp Company Portal</p>
          <p>Khusus untuk pengguna perusahaan yang berwenang</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" />
              Secure
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-500" />
              Enterprise
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;