// src/services/templateLibraryService.js
import { CONFIG } from '../utils/constants';

class TemplateLibraryService {
  constructor() {
    this.baseUrl = `${CONFIG.API_BASE_URL}/notification-gateway/template/library`;
  }

  /**
   * Get authorization header
   * @returns {Object} - Authorization header
   */
  getAuthHeader() {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Fetch all templates dari library dengan filter
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} - API response
   */
  async getTemplates(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim && value.trim() !== '') {
          queryParams.append(key, value);
        } else if (value && typeof value !== 'string') {
          queryParams.append(key, value);
        }
      });

      const url = queryParams.toString() 
        ? `${this.baseUrl}?${queryParams}`
        : this.baseUrl;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeader()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data?.data || [],
        total: data.data?.total || 0,
        message: 'Templates fetched successfully'
      };

    } catch (error) {
      console.error('Error fetching templates:', error);
      return {
        success: false,
        data: [],
        total: 0,
        message: error.message || 'Failed to fetch templates'
      };
    }
  }

  /**
   * Fetch template detail by ID
   * @param {string} templateId - Template ID
   * @returns {Promise<Object>} - Template detail
   */
  async getTemplateById(templateId) {
    try {
      if (!templateId) {
        throw new Error('Template ID is required');
      }

      const response = await fetch(`${this.baseUrl}/${templateId}`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.data) {
        throw new Error('Template not found');
      }

      return {
        success: true,
        data: data.data,
        message: 'Template detail fetched successfully'
      };

    } catch (error) {
      console.error('Error fetching template detail:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch template detail'
      };
    }
  }

  /**
   * Search templates dengan keyword
   * @param {string} keyword - Search keyword
   * @param {Object} additionalFilters - Additional filters
   * @returns {Promise<Object>} - Search results
   */
  async searchTemplates(keyword, additionalFilters = {}) {
    const filters = {
      search: keyword,
      ...additionalFilters
    };

    return await this.getTemplates(filters);
  }

  /**
   * Get templates by category
   * @param {string} category - Template category
   * @param {Object} additionalFilters - Additional filters
   * @returns {Promise<Object>} - Templates by category
   */
  async getTemplatesByCategory(category, additionalFilters = {}) {
    const filters = {
      category: category,
      ...additionalFilters
    };

    return await this.getTemplates(filters);
  }

  /**
   * Get templates by topic
   * @param {string} topic - Template topic
   * @param {Object} additionalFilters - Additional filters
   * @returns {Promise<Object>} - Templates by topic
   */
  async getTemplatesByTopic(topic, additionalFilters = {}) {
    const filters = {
      topic: topic,
      ...additionalFilters
    };

    return await this.getTemplates(filters);
  }

  /**
   * Get templates by usecase
   * @param {string} usecase - Template usecase
   * @param {Object} additionalFilters - Additional filters
   * @returns {Promise<Object>} - Templates by usecase
   */
  async getTemplatesByUsecase(usecase, additionalFilters = {}) {
    const filters = {
      usecase: usecase,
      ...additionalFilters
    };

    return await this.getTemplates(filters);
  }

  /**
   * Get templates by industry
   * @param {string} industry - Template industry
   * @param {Object} additionalFilters - Additional filters
   * @returns {Promise<Object>} - Templates by industry
   */
  async getTemplatesByIndustry(industry, additionalFilters = {}) {
    const filters = {
      industry: industry,
      ...additionalFilters
    };

    return await this.getTemplates(filters);
  }

  /**
   * Get popular templates
   * @param {number} limit - Number of templates to fetch
   * @returns {Promise<Object>} - Popular templates
   */
  async getPopularTemplates(limit = 10) {
    const filters = {
      limit: limit,
      sort: 'popular'
    };

    return await this.getTemplates(filters);
  }

  /**
   * Get recent templates
   * @param {number} limit - Number of templates to fetch
   * @returns {Promise<Object>} - Recent templates
   */
  async getRecentTemplates(limit = 10) {
    const filters = {
      limit: limit,
      sort: 'recent'
    };

    return await this.getTemplates(filters);
  }

  /**
   * Get template categories
   * @returns {Array} - Available categories
   */
  getAvailableCategories() {
    return [
      'MARKETING',
      'UTILITY',
      'AUTHENTICATION'
    ];
  }

  /**
   * Get template topics
   * @returns {Array} - Available topics
   */
  getAvailableTopics() {
    return [
      'ACCOUNT_UPDATES',
      'CUSTOMER_FEEDBACK', 
      'ORDER_MANAGEMENT',
      'PAYMENTS',
      'EVENT_REMINDER',
      'IDENTITY_VERIFICATION'
    ];
  }

  /**
   * Get template usecases
   * @returns {Array} - Available usecases
   */
  getAvailableUsecases() {
    return [
      'ACCOUNT_CREATION_CONFIRMATION',
      'PAYMENT_DUE_REMINDER',
      'FEEDBACK_SURVEY',
      'PAYMENT_ACTION_REQUIRED',
      'SHIPMENT_CONFIRMATION',
      'PAYMENT_OVERDUE',
      'DELIVERY_UPDATE',
      'PAYMENT_CONFIRMATION',
      'ORDER_DELAY',
      'FRAUD_ALERT',
      'DELIVERY_FAILED',
      'AUTO_PAY_REMINDER',
      'DELIVERY_CONFIRMATION',
      'PAYMENT_SCHEDULED',
      'ORDER_PICK_UP',
      'PAYMENT_REJECT_FAIL',
      'ORDER_ACTION_NEEDED',
      'STATEMENT_AVAILABLE',
      'ORDER_CONFIRMATION',
      'LOW_BALANCE_WARNING',
      'ORDER_OR_TRANSACTION_CANCEL',
      'RECEIPT_ATTACHMENT',
      'RETURN_CONFIRMATION',
      'STATEMENT_ATTACHMENT',
      'TRANSACTION_ALERT',
      'IN_PERSON_VERIFICATION',
      'EVENT_DETAILS_REMINDER',
      'EVENT_RSVP_CONFIRMATON'
    ];
  }

  /**
   * Get template industries
   * @returns {Array} - Available industries
   */
  getAvailableIndustries() {
    return [
      'E_COMMERCE',
      'FINANCIAL_SERVICES',
      'HEALTHCARE',
      'EDUCATION',
      'RETAIL',
      'HOSPITALITY',
      'TECHNOLOGY',
      'AUTOMOTIVE',
      'REAL_ESTATE',
      'GOVERNMENT'
    ];
  }

  /**
   * Format template data untuk display
   * @param {Object} template - Raw template data
   * @returns {Object} - Formatted template data
   */
  formatTemplateForDisplay(template) {
    return {
      ...template,
      displayName: template.name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      formattedTopic: template.topic?.replace(/_/g, ' '),
      formattedUsecase: template.usecase?.replace(/_/g, ' '),
      formattedIndustries: template.industry?.map(ind => ind.replace(/_/g, ' ')),
      hasParameters: template.body_params && template.body_params.length > 0,
      parameterCount: template.body_params?.length || 0,
      hasButtons: template.buttons && template.buttons.length > 0,
      buttonCount: template.buttons?.length || 0,
      hasHeader: !!template.header,
      hasFooter: !!template.footer
    };
  }

  /**
   * Validate template data
   * @param {Object} template - Template data to validate
   * @returns {Object} - Validation result
   */
  validateTemplate(template) {
    const errors = [];

    if (!template) {
      errors.push('Template data is required');
      return { isValid: false, errors };
    }

    if (!template.name || template.name.trim() === '') {
      errors.push('Template name is required');
    }

    if (!template.body || template.body.trim() === '') {
      errors.push('Template body is required');
    }

    if (!template.category || template.category.trim() === '') {
      errors.push('Template category is required');
    }

    if (!template.language || template.language.trim() === '') {
      errors.push('Template language is required');
    }

    // Validate parameter consistency
    if (template.body && template.body_params) {
      const positionalRegex = /\{\{(\d+)\}\}/g;
      const namedRegex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
      
      const positionalMatches = [...template.body.matchAll(positionalRegex)];
      const namedMatches = [...template.body.matchAll(namedRegex)];
      
      if (positionalMatches.length > 0 && namedMatches.length > 0) {
        errors.push('Cannot mix positional and named parameters');
      } else if (positionalMatches.length > 0) {
        const variables = positionalMatches.map(match => parseInt(match[1]));
        const maxVar = Math.max(...variables, 0);
        
        if (maxVar !== template.body_params.length) {
          errors.push(`Parameter count mismatch: expected ${maxVar}, got ${template.body_params.length}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get sample/demo templates for development
   * @returns {Array} - Sample templates
   */
  getSampleTemplates() {
    return [
      {
        "name": "account_creation_confirmation_3",
        "language": "en",
        "category": "UTILITY",
        "topic": "ACCOUNT_UPDATES",
        "usecase": "ACCOUNT_CREATION_CONFIRMATION",
        "industry": ["E_COMMERCE", "FINANCIAL_SERVICES"],
        "header": "Finalize account set-up",
        "body": "Hi {{1}},\n\nYour new account has been created successfully. \n\nPlease verify {{2}} to complete your profile.",
        "body_params": ["John", "your email address"],
        "body_param_types": ["TEXT", "TEXT"],
        "buttons": [
          {
            "type": "URL",
            "text": "Verify account",
            "url": "https://www.example.com"
          }
        ],
        "id": "25804093442537649"
      },
      {
        "name": "auto_pay_reminder_1",
        "language": "en",
        "category": "UTILITY",
        "topic": "PAYMENTS",
        "usecase": "AUTO_PAY_REMINDER",
        "industry": ["FINANCIAL_SERVICES"],
        "header": "Upcoming automatic payment",
        "body": "Hi {{1}}, \n\nYour automatic payment for {{2}} is scheduled on {{3}} for {{4}}.\n\nKindly ensure your balance is sufficient to avoid {{5}} fees.",
        "body_params": ["John", "CS Mutual Checking", "Jan 1, 2024", "$12.34", "late"],
        "body_param_types": ["TEXT", "TEXT", "DATE", "AMOUNT", "TEXT"],
        "buttons": [
          {
            "type": "URL",
            "text": "View account",
            "url": "https://www.example.com"
          }
        ],
        "id": "7465715813478141"
      },
      {
        "name": "delivery_confirmation_1",
        "language": "en",
        "category": "UTILITY",
        "topic": "ORDER_MANAGEMENT",
        "usecase": "DELIVERY_CONFIRMATION",
        "industry": ["E_COMMERCE"],
        "body": "{{1}}, your order was successfully delivered! \n\nYou can track your package and manage your order below.",
        "body_params": ["John"],
        "body_param_types": ["TEXT"],
        "buttons": [
          {
            "type": "URL",
            "text": "Manage order",
            "url": "https://www.example.com"
          }
        ],
        "id": "7635027653257090"
      }
    ];
  }
}

// Create and export instance
const templateLibraryService = new TemplateLibraryService();
export default templateLibraryService;