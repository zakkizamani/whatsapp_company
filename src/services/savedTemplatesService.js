// src/services/savedTemplatesService.js
import { CONFIG } from '../utils/constants.js';

/**
 * Service for saved templates API operations
 */
class SavedTemplatesService {
  /**
   * Get templates with filters and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - API response
   */
  async getTemplates(params = {}) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const {
        page = 1,
        size = 10,
        search = '',
        category = '',
        status = '',
        order = 'desc'
      } = params;

      const url = new URL(`${CONFIG.API_BASE_URL}/notification-gateway/template/find`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', size.toString());
      url.searchParams.append('order', order);
      
      if (search.trim()) {
        url.searchParams.append('search', search.trim());
      }
      
      if (category && category !== 'ALL') {
        url.searchParams.append('category', category);
      }
      
      if (status && status !== 'ALL') {
        url.searchParams.append('status', status);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   * @param {string} templateId - Template ID
   * @returns {Promise<Object>} - API response
   */
  async getTemplateById(templateId) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_TEMPLATE_BY_ID}/${templateId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  /**
   * Delete template by ID
   * @param {string} templateId - Template ID
   * @returns {Promise<Object>} - API response
   */
  async deleteTemplate(templateId) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.DELETE_TEMPLATE}/${templateId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  /**
   * Update template by ID
   * @param {string} templateId - Template ID
   * @param {Object} templateData - Updated template data
   * @returns {Promise<Object>} - API response
   */
  async updateTemplate(templateId, templateData) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.UPDATE_TEMPLATE}/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  /**
   * Duplicate template
   * @param {string} templateId - Template ID to duplicate
   * @param {string} newName - New template name
   * @returns {Promise<Object>} - API response
   */
  async duplicateTemplate(templateId, newName) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/notification-gateway/template/${templateId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error duplicating template:', error);
      throw error;
    }
  }

  /**
   * Bulk delete templates
   * @param {string[]} templateIds - Array of template IDs
   * @returns {Promise<Object>} - API response
   */
  async bulkDeleteTemplates(templateIds) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/notification-gateway/template/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ templateIds })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error bulk deleting templates:', error);
      throw error;
    }
  }

  /**
   * Export templates to CSV
   * @returns {Promise<Blob>} - CSV file blob
   */
  async exportTemplates() {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/notification-gateway/template/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;

    } catch (error) {
      console.error('Error exporting templates:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const savedTemplatesService = new SavedTemplatesService();
export default savedTemplatesService;