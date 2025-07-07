// src/services/templateService.js
import { CONFIG } from '../utils/constants';
import { transformToAPIFormat } from '../utils/templateHelpers';

/**
 * Service for template-related API operations
 */
class TemplateService {
  /**
   * Creates a new template
   * @param {Object} templateData - The template data
   * @returns {Promise<Object>} - API response
   */
  async createTemplate(templateData) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const requestBody = transformToAPIFormat(templateData);

      console.log('Submitting template:', requestBody);

      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CREATE_TEMPLATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  /**
   * Gets all templates
   * @returns {Promise<Array>} - Array of templates
   */
  async getTemplates() {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_TEMPLATES}`, {
        method: 'GET',
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
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  /**
   * Updates a template
   * @param {string} templateId - The template ID
   * @param {Object} templateData - The updated template data
   * @returns {Promise<Object>} - API response
   */
  async updateTemplate(templateId, templateData) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const requestBody = transformToAPIFormat(templateData);

      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.UPDATE_TEMPLATE}/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
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
   * Deletes a template
   * @param {string} templateId - The template ID
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
}

// Export singleton instance
export const templateService = new TemplateService();
export default templateService;