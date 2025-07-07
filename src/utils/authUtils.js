import { CONFIG } from './constants';

export const authUtils = {
  /**
   * Validate if user has authorized role
   * @param {Array} roleClaimed - Array of role objects from API
   * @returns {Object} - { isValid: boolean, authorizedRoles: Array, userRoles: Array }
   */
  validateUserRole: (roleClaimed) => {
    if (!Array.isArray(roleClaimed) || roleClaimed.length === 0) {
      return {
        isValid: false,
        authorizedRoles: Object.values(CONFIG.AUTHORIZED_ROLES),
        userRoles: [],
        message: 'Tidak ada role yang ditemukan untuk akun ini.'
      };
    }

    // Extract role names from roleClaimed array
    const userRoles = roleClaimed.map(role => role.name?.toLowerCase()).filter(Boolean);
    
    // Get authorized roles (convert to lowercase for case-insensitive comparison)
    const authorizedRoles = Object.values(CONFIG.AUTHORIZED_ROLES).map(role => role.toLowerCase());
    
    // Check if user has at least one authorized role
    const hasAuthorizedRole = userRoles.some(role => authorizedRoles.includes(role));
    
    return {
      isValid: hasAuthorizedRole,
      authorizedRoles: Object.values(CONFIG.AUTHORIZED_ROLES),
      userRoles: roleClaimed.map(role => role.name).filter(Boolean),
      message: hasAuthorizedRole 
        ? 'Role valid untuk mengakses sistem.'
        // : `Akses ditolak. Hanya role ${Object.values(CONFIG.AUTHORIZED_ROLES.SUPERADMIN).join(' atau ')} yang diizinkan.`
        : `Akses ditolak, hanya yang diizinkan.`
    };
  },

  /**
   * Clear all authentication data from storage
   */
  clearAuthData: () => {
    // Clear all auth-related data from localStorage
    Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear from sessionStorage
    Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
  },

  /**
   * Check if current user has valid role (for use in components)
   * @returns {boolean}
   */
  hasValidRole: () => {
    try {
      const privilegesData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_PRIVILEGES);
      if (!privilegesData) return false;
      
      const privileges = JSON.parse(privilegesData);
      const validation = authUtils.validateUserRole(privileges.roleClaimed);
      
      return validation.isValid;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }
};