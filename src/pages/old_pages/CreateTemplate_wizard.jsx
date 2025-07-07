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
  Workflow,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  Bell,
  Shield,
  Sparkles,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import Layout from '../components/Layout.jsx';
import ToastContainer from '../components/ToastContainer.jsx';
import useToast from '../hooks/useToast.js';
import { CONFIG } from '../utils/constants.js';
import { useNavigate } from 'react-router-dom';

// Helper functions
const detectParameterType = (text) => {
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
  const [currentStep, setCurrentStep] = useState(1);
  const [showButtonDropdown, setShowButtonDropdown] = useState(false);

  // Template form state
  const [templateData, setTemplateData] = useState({
    name: '',
    category: '',
    language: 'en',
    header: {
      type: 'NONE',
      text: '',
      media_url: '',
      media_id: ''
    },
    body: {
      text: '',
      parameterType: 'none',
      examples: [],
      namedExamples: []
    },
    footer: {
      text: ''
    },
    buttons: []
  });

  // Category options with examples
  const categories = [
    {
      value: 'MARKETING',
      label: 'Marketing',
      description: 'Promotional content, offers, and campaigns',
      icon: ShoppingBag,
      gradient: 'from-purple-500 to-pink-500',
      example: {
        header: 'Summer Sale is On! 🌞',
        body: 'Get 25% OFF on all summer collections. Use code SUMMER25 at checkout. Limited time offer!',
        footer: 'Terms and conditions apply',
        buttons: [{ text: 'Shop Now', type: 'URL' }]
      }
    },
    {
      value: 'UTILITY',
      label: 'Utility',
      description: 'Order updates, notifications, and alerts',
      icon: Bell,
      gradient: 'from-blue-500 to-cyan-500',
      example: {
        header: 'Order Update',
        body: 'Good news! Your order #12345 has been shipped and will arrive by tomorrow.',
        footer: 'Track your package',
        buttons: [{ text: 'Track Order', type: 'URL' }]
      }
    },
    {
      value: 'AUTHENTICATION',
      label: 'Authentication',
      description: 'OTP, verification codes, and security',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
      example: {
        header: 'Verification Code',
        body: 'Your WhatsApp verification code is: 123456. Do not share this code with anyone.',
        footer: 'Code expires in 10 minutes',
        buttons: [{ text: 'Copy Code', type: 'COPY_CODE' }]
      }
    }
  ];

  // Button types
  const buttonTypes = {
    PHONE_NUMBER: { icon: Phone, label: 'Call Phone Number' },
    URL: { icon: Link2, label: 'Visit Website' },
    QUICK_REPLY: { icon: MessageSquare, label: 'Quick Reply' },
    COPY_CODE: { icon: Copy, label: 'Copy Code' },
    FLOW: { icon: Workflow, label: 'Flow Button' }
  };

  // Languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'id', name: 'Indonesian' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt_BR', name: 'Portuguese (Brazil)' }
  ];

  // Format text with example values
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

  // Category selection
  const handleCategorySelect = (category) => {
    setTemplateData(prev => ({
      ...prev,
      category: category
    }));
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1 && !templateData.category) {
      showToast('Please select a template category', 'error');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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

    const paramType = detectParameterType(templateData.body.text);
    
    if (paramType === 'mixed') {
      showToast('Cannot mix positional ({{1}}) and named ({{name}}) parameters in the same template', 'error');
      return false;
    }
    
    if (paramType === 'positional') {
      const variables = extractPositionalVariables(templateData.body.text);
      if (variables.length > 0 && templateData.body.examples.length < Math.max(...variables)) {
        showToast('Please provide examples for all positional variables in the message body', 'error');
        return false;
      }
    }
    
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

  // Submit template
  const handleSubmit = async () => {
    if (!validateTemplate()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
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
      
      showToast('Template submitted successfully for approval!', 'success');
      console.log('Template created:', result);
      
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

  // WhatsApp Preview Component
  const WhatsAppPreview = ({ header, body, footer, buttons, examples = [], namedExamples = [] }) => (
    <div 
      className="rounded-xl p-4"
      style={{
        backgroundColor: '#e3ddd3',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="bg-white rounded-2xl p-4 max-w-sm shadow-lg relative">
        <div className="absolute -left-2 top-4 w-0 h-0 border-t-[16px] border-t-transparent border-r-[16px] border-r-white border-b-[16px] border-b-transparent"></div>
        
        {header && (
          <div className="font-bold text-gray-900 mb-3 text-base">
            {header}
          </div>
        )}

        <div className="mb-3 text-gray-800 text-sm leading-relaxed">
          {(examples.length > 0 || namedExamples.length > 0) ? (
            <div dangerouslySetInnerHTML={{ 
              __html: formatTextWithExamples(body, examples, namedExamples) 
            }} />
          ) : (
            body
          )}
        </div>

        {footer && (
          <div className="text-xs text-gray-500 mb-3 italic">
            {footer}
          </div>
        )}

        <div className="flex items-center justify-end gap-1 text-xs text-gray-500 mb-3">
          <Clock className="w-3 h-3" />
          <span>11:30 AM</span>
          <CheckCheck className="w-4 h-4 text-blue-500" />
        </div>

        {buttons && buttons.length > 0 && (
          <div className="border-t border-gray-200 pt-3 space-y-2">
            {buttons.map((button, idx) => (
              <div key={idx} className="flex items-center justify-center py-2.5 px-4 border-2 border-green-500 text-green-600 rounded-full text-sm font-medium hover:bg-green-50 transition-colors cursor-pointer">
                {button.type === 'URL' && '🔗 '}
                {button.type === 'PHONE_NUMBER' && '📞 '}
                {button.type === 'COPY_CODE' && '📋 '}
                {button.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout title="Create Template">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="max-w-7xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Create WhatsApp Template</h1>
              <p className="text-gray-600 text-lg">Design and submit a new message template for approval</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${currentStep >= 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>}
                  <span className="font-medium">Choose Category</span>
                </div>
                <div className={`h-1 w-16 rounded-full transition-all ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${currentStep >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                  <span className="font-medium">Design Template</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Step {currentStep} of 2
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template Category</h2>
              <p className="text-gray-600 text-lg">Select the type of message you want to create</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = templateData.category === category.value;
                
                return (
                  <div key={category.value} className="group">
                    <div
                      onClick={() => handleCategorySelect(category.value)}
                      className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        isSelected ? 'ring-4 ring-green-200' : ''
                      }`}
                    >
                      {/* Category Card */}
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                        {/* Header with Gradient */}
                        <div className={`bg-gradient-to-r ${category.gradient} p-6 text-white`}>
                          <div className="flex items-center justify-between mb-4">
                            <IconComponent className="w-8 h-8" />
                            {isSelected && (
                              <CheckCircle className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{category.label}</h3>
                          <p className="text-sm opacity-90">{category.description}</p>
                        </div>

                        {/* Preview Section */}
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Preview Example
                          </h4>
                          
                          <WhatsAppPreview 
                            header={category.example.header}
                            body={category.example.body}
                            footer={category.example.footer}
                            buttons={category.example.buttons}
                          />
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8">
              <button
                onClick={() => navigate('/templates')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>

              <button
                onClick={nextStep}
                disabled={!templateData.category}
                className={`px-8 py-3 rounded-lg transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg ${
                  templateData.category
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Template Builder */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Selected Category Badge */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  {React.createElement(categories.find(c => c.value === templateData.category)?.icon, { 
                    className: "w-6 h-6 text-green-600" 
                  })}
                  <div>
                    <span className="text-sm text-gray-500">Selected Category:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {categories.find(c => c.value === templateData.category)?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
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
              </div>

              {/* Header Section */}
              <details className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group">
                <summary className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Image className="w-5 h-5 text-gray-600" />
                      Header (Optional)
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4 space-y-4">
                    <div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Header Text</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Media URL</label>
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
                </div>
              </details>

              {/* Body Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Message Body <span className="text-red-500">*</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Text</label>
                    <textarea
                      value={templateData.body.text}
                      onChange={(e) => handleNestedInputChange('body', 'text', e.target.value)}
                      placeholder="Enter your message. Use {{1}}, {{2}} for positional or {{name}}, {{username}} for named variables."
                      rows={4}
                      maxLength={1024}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">{templateData.body.text.length}/1024 characters</p>
                  </div>

                  {/* Variable Examples */}
                  {detectParameterType(templateData.body.text) === 'positional' && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        Variable Examples (Positional)
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{"{{1}}, {{2}}, etc."}</span>
                      </h4>
                      <div className="space-y-2">
                        {templateData.body.examples.map((example, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm font-mono bg-white px-3 py-2 rounded border">{`{{${index + 1}}}`}</span>
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
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        Variable Examples (Named)
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{"{{name}}, {{username}}, etc."}</span>
                      </h4>
                      <div className="space-y-2">
                        {templateData.body.namedExamples.map((namedExample, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm font-mono bg-white px-3 py-2 rounded border">{`{{${namedExample.param_name}}}`}</span>
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
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Invalid Parameter Format</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        Cannot mix positional ({"{{1}}"}) and named ({"{{name}}"}) parameters. Use either all positional or all named.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer & Buttons Section */}
              <details className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group">
                <summary className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-gray-600" />
                      Footer & Buttons (Optional)
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4 space-y-6">
                    {/* Footer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
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

                    {/* Buttons */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Action Buttons</label>
                      
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
                                className="text-red-500 hover:text-red-700 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-3">
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

                      {/* Add Button */}
                      {templateData.buttons.length < 10 && (
                        <div className="relative">
                          <button
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                            onClick={() => setShowButtonDropdown(!showButtonDropdown)}
                          >
                            <Plus className="w-4 h-4" />
                            Add Button
                            <ChevronDown className="w-4 h-4" />
                          </button>

                          {showButtonDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                              {Object.entries(buttonTypes).map(([type, config]) => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    addButton(type);
                                    setShowButtonDropdown(false);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0 transition-colors"
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
                  </div>
                </div>
              </details>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Template
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Preview Section */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  Live Preview
                </h3>

                <WhatsAppPreview 
                  header={templateData.header.type === 'TEXT' ? templateData.header.text : null}
                  body={templateData.body.text || 'Enter your message body to see preview...'}
                  footer={templateData.footer.text}
                  buttons={templateData.buttons}
                  examples={templateData.body.examples}
                  namedExamples={templateData.body.namedExamples}
                />

                {/* Template Info */}
                <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{categories.find(c => c.value === templateData.category)?.label || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{languages.find(l => l.code === templateData.language)?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Components:</span>
                    <span className="font-medium">
                      {[
                        templateData.header.type !== 'NONE' && 'Header',
                        'Body',
                        templateData.footer.text && 'Footer',
                        templateData.buttons.length > 0 && `${templateData.buttons.length} Button${templateData.buttons.length > 1 ? 's' : ''}`
                      ].filter(Boolean).join(', ') || 'Body only'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateTemplate;