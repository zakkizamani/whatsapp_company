import React from 'react';
import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  ChevronDown,
  Link2,
  Phone,
  Copy,
  Image,
  FileText,
  Film,
  Workflow
} from 'lucide-react';
import Layout from '../components/Layout.jsx';
import ToastContainer from '../components/ToastContainer.jsx';
import useToast from '../hooks/useToast.js';
import { CONFIG } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const detectParameterType = (text) => {
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

const extractPositionalVariables = (text) => {
  const regex = /\{\{(\d+)\}\}/g;
  const matches = [...text.matchAll(regex)];
  return matches.map(match => parseInt(match[1]));
};

const extractNamedVariables = (text) => {
  const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
  const matches = [...text.matchAll(regex)];
  return matches.map(match => match[1]);
};

const CreateTemplate = () => {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showButtonDropdown, setShowButtonDropdown] = useState(false);

  // Template form state
  // REPLACE existing templateData state dengan ini:
  const [templateData, setTemplateData] = useState({
    name: '',
    category: 'MARKETING',
    language: 'en',
    header: {
      type: 'NONE',
      text: '',
      media_url: '',
      media_id: ''
    },
    body: {
      text: '',
      parameterType: 'none', // 'none', 'positional', 'named', 'mixed'
      examples: [], // For positional parameters
      namedExamples: [] // For named parameters
    },
    footer: {
      text: ''
    },
    buttons: []
  });

  // Button types - Updated sesuai dengan API
  const buttonTypes = {
    PHONE_NUMBER: { icon: Phone, label: 'Call Phone Number' },
    URL: { icon: Link2, label: 'Visit Website' },
    QUICK_REPLY: { icon: MessageSquare, label: 'Quick Reply' },
    COPY_CODE: { icon: Copy, label: 'Copy Code' },
    FLOW: { icon: Workflow, label: 'Flow Button' }
  };

  // Categories - Updated sesuai dengan enum
  const categories = [
    { value: 'MARKETING', label: 'Marketing', description: 'Promotional content and offers' },
    { value: 'UTILITY', label: 'Utility', description: 'Order updates, alerts, and notifications' },
    { value: 'AUTHENTICATION', label: 'Authentication', description: 'One-time passwords and verification codes' }
  ];

  // Languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'id', name: 'Indonesian' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt_BR', name: 'Portuguese (Brazil)' }
  ];

  // Extract variables from text
  const extractVariables = (text) => {
    const regex = /\{\{(\d+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => parseInt(match[1]));
  };
  // const extractVariables = (text) => {
  //   const regex = /\{\{(\d+)\}\}/g;
  //   const matches = [...text.matchAll(regex)];
  //   return matches.map(match => parseInt(match[1]));
  // };

  // Format text with example values
  // const formatTextWithExamples = (text, examples) => {
  //   let formattedText = text;
  //   examples.forEach((example, index) => {
  //     const placeholder = `{{${index + 1}}}`;
  //     formattedText = formattedText.replace(new RegExp(placeholder, 'g'), `<strong>${example}</strong>`);
  //   });
  //   return formattedText;
  // };
  
  const formatTextWithExamples = (text, examples, namedExamples) => {
    const paramType = detectParameterType(text);
    let formattedText = text;
    
    if (paramType === 'positional' && examples && examples.length > 0) {
      examples.forEach((example, index) => {
        const placeholder = `{{${index + 1}}}`;
        formattedText = formattedText.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), `<strong>${example}</strong>`);
      });
    } else if (paramType === 'named' && namedExamples && namedExamples.length > 0) {
      namedExamples.forEach((namedExample) => {
        const placeholder = `{{${namedExample.param_name}}}`;
        formattedText = formattedText.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), `<strong>${namedExample.example}</strong>`);
      });
    }
    
    return formattedText;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested input changes
  const handleNestedInputChange = (parent, field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Add button
  const addButton = (type) => {
    const newButton = {
      type: type,
      text: '',
      ...(type === 'PHONE_NUMBER' && { phone_number: '' }),
      ...(type === 'URL' && { url: '' }),
      ...(type === 'COPY_CODE' && { example: '' }),
      ...(type === 'FLOW' && { 
        flow_id: '', 
        flow_name: '', 
        flow_json: '', 
        flow_action: 'navigate', 
        navigate_screen: 'FIRST_ENTRY_SCREEN' 
      })
    };

    setTemplateData(prev => ({
      ...prev,
      buttons: [...prev.buttons, newButton]
    }));
  };

  // Remove button
  const removeButton = (index) => {
    setTemplateData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  // Update button
  const updateButton = (index, field, value) => {
    setTemplateData(prev => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) => 
        i === index ? { ...btn, [field]: value } : btn
      )
    }));
  };

  // Validate template
  const validateTemplate = () => {
    if (!templateData.name.trim()) {
      showToast('Template name is required', 'error');
      return false;
    }
  
    if (!/^[a-z0-9_]+$/.test(templateData.name)) {
      showToast('Template name must contain only lowercase letters, numbers, and underscores', 'error');
      return false;
    }
  
    if (!templateData.body.text.trim()) {
      showToast('Message body is required', 'error');
      return false;
    }
  
    // Check parameter type
    const paramType = detectParameterType(templateData.body.text);
    
    if (paramType === 'mixed') {
      showToast('Cannot mix positional ({{1}}) and named ({{name}}) parameters in the same template', 'error');
      return false;
    }
    
    // Validate positional parameters
    if (paramType === 'positional') {
      const variables = extractPositionalVariables(templateData.body.text);
      if (variables.length > 0 && templateData.body.examples.length < Math.max(...variables)) {
        showToast('Please provide examples for all positional variables in the message body', 'error');
        return false;
      }
    }
    
    // Validate named parameters  
    if (paramType === 'named') {
      const variables = extractNamedVariables(templateData.body.text);
      const missingExamples = variables.filter(varName => {
        const example = templateData.body.namedExamples.find(ex => ex.param_name === varName);
        return !example || !example.example.trim();
      });
      
      if (missingExamples.length > 0) {
        showToast(`Please provide examples for variables: ${missingExamples.join(', ')}`, 'error');
        return false;
      }
    }
  
    // Validate buttons (existing logic)
    for (let i = 0; i < templateData.buttons.length; i++) {
      const button = templateData.buttons[i];
      if (!button.text.trim()) {
        showToast(`Button ${i + 1} text is required`, 'error');
        return false;
      }
  
      if (button.type === 'URL' && !button.url) {
        showToast(`Button ${i + 1} URL is required`, 'error');
        return false;
      }
  
      if (button.type === 'PHONE_NUMBER' && !button.phone_number) {
        showToast(`Button ${i + 1} phone number is required`, 'error');
        return false;
      }
  
      if (button.type === 'COPY_CODE' && !button.example) {
        showToast(`Button ${i + 1} example is required`, 'error');
        return false;
      }
  
      if (button.type === 'FLOW' && !button.flow_id) {
        showToast(`Button ${i + 1} flow ID is required`, 'error');
        return false;
      }
    }
  
    return true;
  };
  

  // Submit template - Updated sesuai dengan API
  const handleSubmit = async () => {
    if (!validateTemplate()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      // Prepare request body sesuai dengan struktur API
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
          // Add example if it's a text header with variables
          const headerVariables = extractVariables(templateData.header.text);
          if (headerVariables.length > 0) {
            headerComponent.example = [`Example for header`]; // You can make this dynamic
          }
        } else {
          // For media headers, example should be an array of strings
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

      // if (templateData.body.examples.length > 0) {
      //   bodyComponent.example = templateData.body.examples;
      // }
      
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

            // Add specific fields based on button type
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
              // QUICK_REPLY doesn't need additional fields
            }

            return btn;
          })
        };

        requestBody.components.push(buttonComponent);
      }

      console.log('Submitting template:', requestBody);

      // API call ke endpoint yang sebenarnya
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
      
      showToast('Template submitted successfully for approval!', 'success');
      console.log('Template created:', result);
      
      // Navigate to template library after 2 seconds
      setTimeout(() => {
        navigate('/templates');
      }, 2000);

    } catch (error) {
      console.error('Error creating template:', error);
      showToast(error.message || 'Failed to create template', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update body examples when body text changes
  // useEffect(() => {
  //   const variables = extractVariables(templateData.body.text);
  //   const maxVar = Math.max(...variables, 0);
    
  //   // Adjust examples array size
  //   if (maxVar > templateData.body.examples.length) {
  //     const newExamples = [...templateData.body.examples];
  //     for (let i = templateData.body.examples.length; i < maxVar; i++) {
  //       newExamples.push('');
  //     }
  //     setTemplateData(prev => ({
  //       ...prev,
  //       body: {
  //         ...prev.body,
  //         examples: newExamples
  //       }
  //     }));
  //   } else if (maxVar < templateData.body.examples.length) {
  //     setTemplateData(prev => ({
  //       ...prev,
  //       body: {
  //         ...prev.body,
  //         examples: prev.body.examples.slice(0, maxVar)
  //       }
  //     }));
  //   }
  // }, [templateData.body.text]);
  useEffect(() => {
    const paramType = detectParameterType(templateData.body.text);
    
    if (paramType === 'positional') {
      const variables = extractPositionalVariables(templateData.body.text);
      const maxVar = Math.max(...variables, 0);
      
      // Auto-adjust positional examples array
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
      
      // Auto-adjust named examples array
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
      // No parameters
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

  return (
    <Layout title="Create Template">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Create WhatsApp Template</h1>
              <p className="text-gray-600 text-lg">Design and submit a new message template for approval</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              {/* Template Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateData.name}
                  onChange={(e) => handleInputChange('name', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                  placeholder="e.g., welcome_message_v1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Use lowercase letters, numbers, and underscores only</p>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={templateData.category === cat.value}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{cat.label}</div>
                        <div className="text-sm text-gray-500">{cat.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  value={templateData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Header (Optional)</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Header Type</label>
                <select
                  value={templateData.header.type}
                  onChange={(e) => handleNestedInputChange('header', 'type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="NONE">None</option>
                  <option value="TEXT">Text</option>
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document</option>
                </select>
              </div>

              {templateData.header.type === 'TEXT' && (
                <div>
                  <input
                    type="text"
                    value={templateData.header.text}
                    onChange={(e) => handleNestedInputChange('header', 'text', e.target.value)}
                    placeholder="Enter header text"
                    maxLength={60}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">{templateData.header.text.length}/60 characters</p>
                </div>
              )}

              {['IMAGE', 'VIDEO', 'DOCUMENT'].includes(templateData.header.type) && (
                <div>
                  <input
                    type="url"
                    value={templateData.header.media_url}
                    onChange={(e) => handleNestedInputChange('header', 'media_url', e.target.value)}
                    placeholder="Enter media URL"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Provide a sample media URL for preview</p>
                </div>
              )}
            </div>

            {/* Body Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Body <span className="text-red-500">*</span></h3>
              
              <div className="mb-4">
                <textarea
                  value={templateData.body.text}
                  onChange={(e) => handleNestedInputChange('body', 'text', e.target.value)}
                  placeholder="Enter your message. Use {{1}}, {{2}}, etc. for variables."
                  rows={6}
                  maxLength={1024}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">{templateData.body.text.length}/1024 characters</p>
              </div>

              {/* Variable Examples */}
              {detectParameterType(templateData.body.text) === 'positional' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      Variable Examples (Positional)
                      {/* <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{{1}}, {{2}}, etc.</span> */}
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{"{{1}}, {{2}}, etc."}</span>
                    </h4>
                    <div className="space-y-2">
                      {templateData.body.examples.map((example, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{`{{${index + 1}}}`}</span>
                          <input
                            type="text"
                            value={example}
                            onChange={(e) => {
                              const newExamples = [...templateData.body.examples];
                              newExamples[index] = e.target.value;
                              handleNestedInputChange('body', 'examples', newExamples);
                            }}
                            placeholder={`Example for variable ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detectParameterType(templateData.body.text) === 'named' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      Variable Examples (Named)
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">({'{{name}}'}), ({'{username}'}), etc.</span>
                    </h4>
                    <div className="space-y-2">
                      {templateData.body.namedExamples.map((namedExample, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">{`{{${namedExample.param_name}}}`}</span>
                          <input
                            type="text"
                            value={namedExample.example}
                            onChange={(e) => {
                              const newNamedExamples = [...templateData.body.namedExamples];
                              newNamedExamples[index].example = e.target.value;
                              handleNestedInputChange('body', 'namedExamples', newNamedExamples);
                            }}
                            placeholder={`Example for ${namedExample.param_name}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detectParameterType(templateData.body.text) === 'mixed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Invalid Parameter Format</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Cannot mix positional ({'{{1}}'}) and named ({'{{name}}'}) parameters. Use either all positional or all named.
                    </p>
                  </div>
                )}
            </div>

            {/* Footer Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer (Optional)</h3>
              
              <input
                type="text"
                value={templateData.footer.text}
                onChange={(e) => handleNestedInputChange('footer', 'text', e.target.value)}
                placeholder="Enter footer text"
                maxLength={60}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">{templateData.footer.text.length}/60 characters</p>
            </div>

            {/* Buttons Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buttons (Optional)</h3>
              
              {/* Existing Buttons */}
              <div className="space-y-3 mb-4">
                {templateData.buttons.map((button, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {React.createElement(buttonTypes[button.type].icon, { className: "w-4 h-4 text-gray-600" })}
                        <span className="text-sm font-medium text-gray-700">{buttonTypes[button.type].label}</span>
                      </div>
                      <button
                        onClick={() => removeButton(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) => updateButton(index, 'text', e.target.value)}
                        placeholder="Button text"
                        maxLength={25}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />

                      {button.type === 'URL' && (
                        <input
                          type="url"
                          value={button.url}
                          onChange={(e) => updateButton(index, 'url', e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      )}

                      {button.type === 'PHONE_NUMBER' && (
                        <input
                          type="tel"
                          value={button.phone_number}
                          onChange={(e) => updateButton(index, 'phone_number', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      )}

                      {button.type === 'COPY_CODE' && (
                        <input
                          type="text"
                          value={button.example}
                          onChange={(e) => updateButton(index, 'example', e.target.value)}
                          placeholder="Example code"
                          maxLength={15}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      )}

                      {button.type === 'FLOW' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={button.flow_id}
                            onChange={(e) => updateButton(index, 'flow_id', e.target.value)}
                            placeholder="Flow ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <input
                            type="text"
                            value={button.flow_name}
                            onChange={(e) => updateButton(index, 'flow_name', e.target.value)}
                            placeholder="Flow Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Button Dropdown */}
              {templateData.buttons.length < 10 && (
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                    onClick={() => setShowButtonDropdown(!showButtonDropdown)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Button
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showButtonDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      {Object.entries(buttonTypes).map(([type, config]) => (
                        <button
                          key={type}
                          onClick={() => {
                            addButton(type);
                            setShowButtonDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                        >
                          {React.createElement(config.icon, { className: "w-4 h-4 text-gray-600" })}
                          <span className="text-sm text-gray-700">{config.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500">You can add up to 10 buttons</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Template...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Template
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/templates')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Template Preview
              </h3>

              {/* WhatsApp Chat Preview */}
              <div 
                className="rounded-xl p-4"
                style={{
                  backgroundColor: '#e3ddd3',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                <div className="bg-white rounded-2xl p-4 max-w-sm shadow-sm relative">
                  {/* Chat bubble tail */}
                  <div className="absolute -left-2 top-4 w-0 h-0 border-t-[16px] border-t-transparent border-r-[16px] border-r-white border-b-[16px] border-b-transparent"></div>
                  
                  {/* Header */}
                  {templateData.header.type === 'TEXT' && templateData.header.text && (
                    <div className="font-bold text-gray-900 mb-3 text-base">
                      {templateData.header.text}
                    </div>
                  )}

                  {templateData.header.type === 'IMAGE' && templateData.header.media_url && (
                    <div className="mb-3">
                      <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {templateData.header.type === 'VIDEO' && templateData.header.media_url && (
                    <div className="mb-3">
                      <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center relative">
                        <Film className="w-12 h-12 text-gray-400" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-gray-700 border-b-[10px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {templateData.header.type === 'DOCUMENT' && templateData.header.media_url && (
                    <div className="mb-3">
                      <div className="bg-gray-200 rounded-lg p-3 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-gray-500" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">Document.pdf</div>
                          <div className="text-gray-500">12.5 MB</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div className="mb-3 text-gray-800 text-sm">
                    {/* {templateData.body.examples.length > 0 ? (
                      <div dangerouslySetInnerHTML={{ __html: formatTextWithExamples(templateData.body.text, templateData.body.examples) }} />
                    ) : (
                      templateData.body.text
                    )} */}
                    {(templateData.body.examples.length > 0 || templateData.body.namedExamples.length > 0) ? (
                      <div dangerouslySetInnerHTML={{ 
                        __html: formatTextWithExamples(
                          templateData.body.text, 
                          templateData.body.examples, 
                          templateData.body.namedExamples
                        ) 
                      }} />
                    ) : (
                      templateData.body.text
                    )}
                  </div>

                  {/* Footer */}
                  {templateData.footer.text && (
                    <div className="text-xs text-gray-500 mt-2">
                      {templateData.footer.text}
                    </div>
                  )}

                  {/* Buttons */}
                  {templateData.buttons.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {templateData.buttons.map((button, index) => (
                        <div key={index} className="flex">
                          {button.type === 'QUICK_REPLY' ? (
                            <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">
                              {button.text}
                            </button>
                          ) : (
                            <button className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white flex items-center gap-2">
                              {React.createElement(buttonTypes[button.type].icon, { className: "w-4 h-4" })}
                              {button.text}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTemplate;