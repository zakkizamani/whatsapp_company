// src/utils/templateTransformationUtils.js
// Utility functions untuk transformasi data template antara library dan create form

/**
 * Transform template library data ke format create template
 * @param {Object} libraryTemplate - Template data dari library API
 * @returns {Object} - Template data dalam format create form
 */
export const transformLibraryToCreateFormat = (libraryTemplate) => {
    const transformedData = {
      name: generateCustomName(libraryTemplate.name),
      category: libraryTemplate.category || '',
      language: libraryTemplate.language || 'en',
      header: {
        type: libraryTemplate.header ? 'TEXT' : 'NONE',
        text: libraryTemplate.header || '',
        media_url: '',
        media_id: ''
      },
      body: {
        text: libraryTemplate.body || '',
        parameterType: 'none',
        examples: [],
        namedExamples: []
      },
      footer: {
        text: libraryTemplate.footer || ''
      },
      buttons: libraryTemplate.buttons || []
    };
  
    // Handle body parameters
    if (libraryTemplate.body_params && libraryTemplate.body_params.length > 0) {
      const paramType = detectParameterType(libraryTemplate.body);
      
      if (paramType === 'positional') {
        transformedData.body.parameterType = 'positional';
        transformedData.body.examples = libraryTemplate.body_params;
      } else if (paramType === 'named') {
        transformedData.body.parameterType = 'named';
        const namedVariables = extractNamedVariables(libraryTemplate.body);
        transformedData.body.namedExamples = namedVariables.map((varName, index) => ({
          param_name: varName,
          example: libraryTemplate.body_params[index] || ''
        }));
      }
    }
  
    return transformedData;
  };
  
  /**
   * Generate custom name dari library template name
   * @param {string} originalName - Nama template original dari library
   * @returns {string} - Nama template yang sudah di-customize
   */
  export const generateCustomName = (originalName) => {
    const timestamp = Date.now();
    const customSuffix = `_custom_${timestamp}`;
    const maxLength = 512; // WhatsApp template name limit
    
    // Pastikan nama tidak melebihi batas
    const baseLength = maxLength - customSuffix.length;
    const baseName = originalName.length > baseLength 
      ? originalName.substring(0, baseLength) 
      : originalName;
      
    return `${baseName}${customSuffix}`;
  };
  
  /**
   * Detect parameter type dari body text
   * @param {string} text - Body text template
   * @returns {string} - 'positional', 'named', 'mixed', atau 'none'
   */
  export const detectParameterType = (text) => {
    if (!text) return 'none';
    
    const positionalRegex = /\{\{(\d+)\}\}/g;
    const namedRegex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
    
    const positionalMatches = [...text.matchAll(positionalRegex)];
    const namedMatches = [...text.matchAll(namedRegex)];
    
    if (positionalMatches.length > 0 && namedMatches.length > 0) {
      return 'mixed'; // Error case - tidak bisa mix
    } else if (positionalMatches.length > 0) {
      return 'positional';
    } else if (namedMatches.length > 0) {
      return 'named';
    }
    return 'none';
  };
  
  /**
   * Extract positional variables dari text
   * @param {string} text - Text yang mengandung variables
   * @returns {Array<number>} - Array nomor variables
   */
  export const extractPositionalVariables = (text) => {
    if (!text) return [];
    
    const regex = /\{\{(\d+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => parseInt(match[1]));
  };
  
  /**
   * Extract named variables dari text
   * @param {string} text - Text yang mengandung variables
   * @returns {Array<string>} - Array nama variables
   */
  export const extractNamedVariables = (text) => {
    if (!text) return [];
    
    const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1]);
  };
  
  /**
   * Validate library template data sebelum transformasi
   * @param {Object} libraryTemplate - Template data dari library
   * @returns {Object} - { isValid: boolean, errors: Array<string> }
   */
  export const validateLibraryTemplate = (libraryTemplate) => {
    const errors = [];
    
    if (!libraryTemplate) {
      errors.push('Template data is required');
      return { isValid: false, errors };
    }
    
    if (!libraryTemplate.name || libraryTemplate.name.trim() === '') {
      errors.push('Template name is required');
    }
    
    if (!libraryTemplate.body || libraryTemplate.body.trim() === '') {
      errors.push('Template body is required');
    }
    
    if (!libraryTemplate.category || libraryTemplate.category.trim() === '') {
      errors.push('Template category is required');
    }
    
    // Validate parameter consistency
    if (libraryTemplate.body && libraryTemplate.body_params) {
      const paramType = detectParameterType(libraryTemplate.body);
      
      if (paramType === 'positional') {
        const variables = extractPositionalVariables(libraryTemplate.body);
        const maxVar = Math.max(...variables, 0);
        
        if (maxVar !== libraryTemplate.body_params.length) {
          errors.push(`Parameter count mismatch: expected ${maxVar}, got ${libraryTemplate.body_params.length}`);
        }
      } else if (paramType === 'named') {
        const variables = extractNamedVariables(libraryTemplate.body);
        
        if (variables.length !== libraryTemplate.body_params.length) {
          errors.push(`Named parameter count mismatch: expected ${variables.length}, got ${libraryTemplate.body_params.length}`);
        }
      } else if (paramType === 'mixed') {
        errors.push('Cannot mix positional and named parameters');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Format template body dengan contoh parameters untuk preview
   * @param {string} body - Template body text
   * @param {Array} params - Array parameter examples
   * @returns {string} - Formatted body text
   */
  export const formatTemplateBodyWithParams = (body, params) => {
    if (!body || !params || params.length === 0) {
      return body || '';
    }
    
    let formattedBody = body;
    
    // Handle positional parameters
    params.forEach((param, index) => {
      const placeholder = `{{${index + 1}}}`;
      const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
      formattedBody = formattedBody.replace(regex, `**${param}**`);
    });
    
    return formattedBody;
  };
  
  /**
   * Store template data dalam sessionStorage untuk transfer
   * @param {Object} templateData - Data template yang akan disimpan
   * @param {string} key - Key untuk storage (default: 'libraryTemplateData')
   */
  export const storeTemplateData = (templateData, key = 'libraryTemplateData') => {
    try {
      sessionStorage.setItem(key, JSON.stringify(templateData));
      return true;
    } catch (error) {
      console.error('Error storing template data:', error);
      return false;
    }
  };
  
  /**
   * Retrieve template data dari sessionStorage
   * @param {string} key - Key storage (default: 'libraryTemplateData')
   * @param {boolean} removeAfterRead - Hapus data setelah dibaca (default: true)
   * @returns {Object|null} - Template data atau null jika tidak ada
   */
  export const retrieveTemplateData = (key = 'libraryTemplateData', removeAfterRead = true) => {
    try {
      const storedData = sessionStorage.getItem(key);
      
      if (storedData) {
        const templateData = JSON.parse(storedData);
        
        if (removeAfterRead) {
          sessionStorage.removeItem(key);
        }
        
        return templateData;
      }
      
      return null;
    } catch (error) {
      console.error('Error retrieving template data:', error);
      return null;
    }
  };
  
  /**
   * Check apakah ada template data tersimpan
   * @param {string} key - Key storage (default: 'libraryTemplateData')
   * @returns {boolean} - True jika ada data tersimpan
   */
  export const hasStoredTemplateData = (key = 'libraryTemplateData') => {
    try {
      const storedData = sessionStorage.getItem(key);
      return storedData !== null && storedData !== undefined;
    } catch (error) {
      console.error('Error checking stored template data:', error);
      return false;
    }
  };
  
  /**
   * Clear stored template data
   * @param {string} key - Key storage (default: 'libraryTemplateData')
   */
  export const clearStoredTemplateData = (key = 'libraryTemplateData') => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing stored template data:', error);
      return false;
    }
  };
  
  // Export semua functions
  export default {
    transformLibraryToCreateFormat,
    generateCustomName,
    detectParameterType,
    extractPositionalVariables,
    extractNamedVariables,
    validateLibraryTemplate,
    formatTemplateBodyWithParams,
    storeTemplateData,
    retrieveTemplateData,
    hasStoredTemplateData,
    clearStoredTemplateData
  };