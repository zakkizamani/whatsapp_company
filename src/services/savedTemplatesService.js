// src/services/savedTemplatesService.js
import { CONFIG } from '../utils/constants';

/**
 * Service for saved templates operations
 */
class SavedTemplatesService {
  /**
   * Get all saved templates with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.size - Page size
   * @param {string} params.order - Sort order (asc/desc)
   * @param {string} params.search - Search query
   * @param {string} params.category - Category filter
   * @param {string} params.status - Status filter
   * @returns {Promise<Object>} - API response
   */
  async getTemplates(params = {}) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const url = new URL(`${CONFIG.API_BASE_URL}/notification-gateway/template/find`);
      
      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error fetching saved templates:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   * @param {string} templateId - Template ID
   * @returns {Promise<Object>} - Template data
   */
  async getTemplateById(templateId) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/${CONFIG.ENDPOINTS.GET_TEMPLATE_BY_ID}/${templateId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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

      const response = await fetch(`${CONFIG.API_BASE_URL}/notification-gateway/template/${templateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
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

      const response = await fetch(`${CONFIG.API_BASE_URL}/${CONFIG.ENDPOINTS.UPDATE_TEMPLATE}/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
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
   * Get template statistics
   * @returns {Promise<Object>} - Template statistics
   */
  async getTemplateStats() {
    try {
      const templates = await this.getTemplates({ size: 1000 }); // Get all templates for stats
      
      if (!templates.data || !templates.data.items) {
        return {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          flagged: 0,
          disabled: 0
        };
      }

      const items = templates.data.items;
      const stats = {
        total: items.length,
        approved: items.filter(t => t.status === 'APPROVED').length,
        pending: items.filter(t => t.status === 'PENDING').length,
        rejected: items.filter(t => t.status === 'REJECTED').length,
        flagged: items.filter(t => t.status === 'FLAGGED').length,
        disabled: items.filter(t => t.status === 'DISABLED').length,
        paused: items.filter(t => t.status === 'PAUSED').length,
        inAppeal: items.filter(t => t.status === 'IN_APPEAL').length,
        reinstated: items.filter(t => t.status === 'REINSTATED').length,
        pendingDeletion: items.filter(t => t.status === 'PENDING_DELETION').length
      };

      return stats;

    } catch (error) {
      console.error('Error fetching template stats:', error);
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
        const errorData = await response.json();
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
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error bulk deleting templates:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const savedTemplatesService = new SavedTemplatesService();
export default savedTemplatesService;