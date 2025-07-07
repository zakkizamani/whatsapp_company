import { CONFIG } from '../utils/constants.js';
import { generateNonce, encodeCredentials } from '../utils/helper.js';

export const authService = {
  login: async (username, password) => {
    const nonce = generateNonce();
    const encodedCredentials = encodeCredentials(username, password);
    
    // Debug logs (remove in production)
    console.log('Nonce:', nonce);
    console.log('Encoded credentials:', encodedCredentials);
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nonce: nonce
        })
      });
      
      // Check if response is ok
      if (!response.ok) {
        let errorMessage = 'Login gagal. Periksa kembali username dan password Anda.';
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // If JSON parsing fails, use default message
          console.error('Error parsing response:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (fetchError) {
      // Handle network errors
      if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      }
      throw fetchError;
    }
  },

  // Get user privileges
  getPrivileges: async (token) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.PRIVILEGES}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Gagal mengambil data privilege.';
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error('Error parsing privilege response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (fetchError) {
      if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
        throw new Error('Tidak dapat terhubung ke server untuk mengambil privilege.');
      }
      throw fetchError;
    }
  },

  // Get user account information
  getUserAccount: async (token) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.USER_ACCOUNT}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Gagal mengambil data akun pengguna.';
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error('Error parsing user account response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (fetchError) {
      if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
        throw new Error('Tidak dapat terhubung ke server untuk mengambil data akun.');
      }
      throw fetchError;
    }
  }
};