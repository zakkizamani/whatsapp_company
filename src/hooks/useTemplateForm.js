// src/hooks/useTemplateForm.js
import { useState, useEffect } from 'react';
import { 
  INITIAL_TEMPLATE_DATA,
  detectParameterType,
  extractPositionalVariables,
  extractNamedVariables
} from '../utils/templateHelpers';

/**
 * Custom hook for managing template form state and operations
 */
export const useTemplateForm = (initialData = INITIAL_TEMPLATE_DATA) => {
  const [templateData, setTemplateData] = useState(initialData);

  // Input handlers
  const handleInputChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Button operations
  const addButton = (newButton) => {
    setTemplateData(prev => ({
      ...prev,
      buttons: [...prev.buttons, newButton]
    }));
  };

  const removeButton = (index) => {
    setTemplateData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const updateButton = (index, field, value) => {
    setTemplateData(prev => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) => 
        i === index ? { ...btn, [field]: value } : btn
      )
    }));
  };

  // Reset form
  const resetForm = () => {
    setTemplateData(INITIAL_TEMPLATE_DATA);
  };

  // Auto-generate examples based on body text
  useEffect(() => {
    const paramType = detectParameterType(templateData.body.text);
    
    if (paramType === 'positional') {
      const variables = extractPositionalVariables(templateData.body.text);
      const maxVar = Math.max(...variables, 0);
      
      if (maxVar !== templateData.body.examples.length || templateData.body.parameterType !== 'positional') {
        const newExamples = Array(maxVar).fill('').map((_, i) => 
          templateData.body.examples[i] || ''
        );
        
        setTemplateData(prev => ({
          ...prev,
          body: {
            ...prev.body,
            parameterType: 'positional',
            examples: newExamples,
            namedExamples: []
          }
        }));
      }
    } else if (paramType === 'named') {
      const variables = extractNamedVariables(templateData.body.text);
      
      const newNamedExamples = variables.map(varName => {
        const existing = templateData.body.namedExamples.find(ex => ex.param_name === varName);
        return existing || { param_name: varName, example: '' };
      });
      
      if (JSON.stringify(newNamedExamples) !== JSON.stringify(templateData.body.namedExamples) || templateData.body.parameterType !== 'named') {
        setTemplateData(prev => ({
          ...prev,
          body: {
            ...prev.body,
            parameterType: 'named',
            examples: [],
            namedExamples: newNamedExamples
          }
        }));
      }
    } else {
      if (templateData.body.parameterType !== 'none') {
        setTemplateData(prev => ({
          ...prev,
          body: {
            ...prev.body,
            parameterType: 'none',
            examples: [],
            namedExamples: []
          }
        }));
      }
    }
  }, [templateData.body.text, templateData.body.examples, templateData.body.namedExamples, templateData.body.parameterType]);

  return {
    templateData,
    setTemplateData,
    handleInputChange,
    handleNestedInputChange,
    addButton,
    removeButton,
    updateButton,
    resetForm
  };
};