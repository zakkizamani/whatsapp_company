// src/utils/templateHelpers.js

/**
 * Detects the parameter type in template text
 * @param {string} text - The template text
 * @returns {string} - 'positional', 'named', 'mixed', or 'none'
 */
export const detectParameterType = (text) => {
    const positionalRegex = /\{\{(\d+)\}\}/g;
    const namedRegex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
    
    const positionalMatches = [...text.matchAll(positionalRegex)];
    const namedMatches = [...text.matchAll(namedRegex)];
    
    if (positionalMatches.length > 0 && namedMatches.length > 0) {
      return 'mixed';
    } else if (positionalMatches.length > 0) {
      return 'positional';
    } else if (namedMatches.length > 0) {
      return 'named';
    }
    return 'none';
  };
  
  /**
   * Extracts positional variables from template text
   * @param {string} text - The template text
   * @returns {number[]} - Array of variable numbers
   */
  export const extractPositionalVariables = (text) => {
    const regex = /\{\{(\d+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => parseInt(match[1]));
  };
  
  /**
   * Extracts named variables from template text
   * @param {string} text - The template text
   * @returns {string[]} - Array of variable names
   */
  export const extractNamedVariables = (text) => {
    const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1]);
  };
  
  /**
   * Formats text with example values for preview
   * @param {string} text - The template text
   * @param {string[]} examples - Positional examples
   * @param {Object[]} namedExamples - Named examples
   * @returns {string} - Formatted text with examples
   */
  export const formatTextWithExamples = (text, examples = [], namedExamples = []) => {
    const paramType = detectParameterType(text);
    let formattedText = text;
    
    if (paramType === 'positional' && examples && examples.length > 0) {
      examples.forEach((example, index) => {
        const placeholder = `{{${index + 1}}}`;
        formattedText = formattedText.replace(
          new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), 
          `<strong>${example}</strong>`
        );
      });
    } else if (paramType === 'named' && namedExamples && namedExamples.length > 0) {
      namedExamples.forEach((namedExample) => {
        const placeholder = `{{${namedExample.param_name}}}`;
        formattedText = formattedText.replace(
          new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), 
          `<strong>${namedExample.example}</strong>`
        );
      });
    }
    
    return formattedText;
  };
  
  /**
   * Validates template data
   * @param {Object} templateData - The template data
   * @returns {Object} - { isValid: boolean, error: string }
   */
  export const validateTemplate = (templateData) => {
    // Name validation
    if (!templateData.name.trim()) {
      return { isValid: false, error: 'Template name is required' };
    }
  
    if (!/^[a-z0-9_]+$/.test(templateData.name)) {
      return { 
        isValid: false, 
        error: 'Template name must contain only lowercase letters, numbers, and underscores' 
      };
    }
  
    // Body validation
    if (!templateData.body.text.trim()) {
      return { isValid: false, error: 'Message body is required' };
    }
  
    const paramType = detectParameterType(templateData.body.text);
    
    if (paramType === 'mixed') {
      return { 
        isValid: false, 
        error: 'Cannot mix positional ({{1}}) and named ({{name}}) parameters in the same template' 
      };
    }
    
    // Positional parameters validation
    if (paramType === 'positional') {
      const variables = extractPositionalVariables(templateData.body.text);
      if (variables.length > 0 && templateData.body.examples.length < Math.max(...variables)) {
        return { 
          isValid: false, 
          error: 'Please provide examples for all positional variables in the message body' 
        };
      }
    }
    
    // Named parameters validation
    if (paramType === 'named') {
      const variables = extractNamedVariables(templateData.body.text);
      const missingExamples = variables.filter(varName => {
        const example = templateData.body.namedExamples.find(ex => ex.param_name === varName);
        return !example || !example.example.trim();
      });
      
      if (missingExamples.length > 0) {
        return { 
          isValid: false, 
          error: `Please provide examples for variables: ${missingExamples.join(', ')}` 
        };
      }
    }
  
    // Buttons validation
    for (let i = 0; i < templateData.buttons.length; i++) {
      const button = templateData.buttons[i];
      if (!button.text.trim()) {
        return { isValid: false, error: `Button ${i + 1} text is required` };
      }
  
      if (button.type === 'URL' && !button.url) {
        return { isValid: false, error: `Button ${i + 1} URL is required` };
      }
  
      if (button.type === 'PHONE_NUMBER' && !button.phone_number) {
        return { isValid: false, error: `Button ${i + 1} phone number is required` };
      }
  
      if (button.type === 'COPY_CODE' && !button.example) {
        return { isValid: false, error: `Button ${i + 1} example is required` };
      }
  
      if (button.type === 'FLOW' && !button.flow_id) {
        return { isValid: false, error: `Button ${i + 1} flow ID is required` };
      }
    }
  
    return { isValid: true, error: null };
  };
  
  /**
   * Transforms template data to API request format
   * @param {Object} templateData - The template data
   * @returns {Object} - API request body
   */
  export const transformToAPIFormat = (templateData) => {
    const requestBody = {
      name: templateData.name,
      category: templateData.category,
      language: templateData.language,
      components: []
    };
  
    // Add header component if exists
    if (templateData.header.type !== 'NONE') {
      const headerComponent = {
        type: 'HEADER',
        format: templateData.header.type
      };
  
      if (templateData.header.type === 'TEXT') {
        headerComponent.text = templateData.header.text;
        const headerVariables = extractPositionalVariables(templateData.header.text);
        if (headerVariables.length > 0) {
          headerComponent.example = [`Example for header`];
        }
      } else {
        if (templateData.header.media_url) {
          headerComponent.example = [templateData.header.media_url];
        }
      }
  
      requestBody.components.push(headerComponent);
    }
  
    // Add body component
    const bodyComponent = {
      type: 'BODY',
      text: templateData.body.text
    };
  
    const paramType = detectParameterType(templateData.body.text);
    
    if (paramType === 'positional' && templateData.body.examples.length > 0) {
      bodyComponent.example = {
        body_text: [templateData.body.examples]
      };
    } else if (paramType === 'named' && templateData.body.namedExamples.length > 0) {
      bodyComponent.example = {
        body_text_named_params: templateData.body.namedExamples
      };
    }
  
    requestBody.components.push(bodyComponent);
  
    // Add footer component if exists
    if (templateData.footer.text) {
      requestBody.components.push({
        type: 'FOOTER',
        text: templateData.footer.text
      });
    }
  
    // Add buttons component if exists
    if (templateData.buttons.length > 0) {
      const buttonComponent = {
        type: 'BUTTONS',
        buttons: templateData.buttons.map(button => {
          const btn = {
            type: button.type,
            text: button.text
          };
  
          switch (button.type) {
            case 'PHONE_NUMBER':
              btn.phone_number = button.phone_number;
              break;
            case 'URL':
              btn.url = button.url;
              break;
            case 'COPY_CODE':
              btn.example = button.example;
              break;
            case 'FLOW':
              btn.flow_id = button.flow_id;
              btn.flow_name = button.flow_name;
              btn.flow_json = button.flow_json;
              btn.flow_action = button.flow_action;
              btn.navigate_screen = button.navigate_screen;
              break;
          }
  
          return btn;
        })
      };
  
      requestBody.components.push(buttonComponent);
    }
  
    return requestBody;
  };