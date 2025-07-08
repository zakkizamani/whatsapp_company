// src/pages/CreateTemplate.jsx - Enhanced dengan Library Integration & Edit Mode
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Save, 
  Eye, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Image,
  Plus,
  ChevronDown,
  Loader2,
  Edit,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';

// Components
import Layout from '../components/Layout.jsx';
import ToastContainer from '../components/ToastContainer.jsx';
import WhatsAppPreview from '../components/create_template/WhatsAppPreview.jsx';
import CategorySelection from '../components/create_template/CategorySelection.jsx';
import BasicInfoForm from '../components/create_template/BasicInfoForm.jsx';
import BodyForm from '../components/create_template/BodyForm.jsx';
import ButtonsForm from '../components/create_template/ButtonsForm.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

// Hooks & Services
import useToast from '../hooks/useToast.js';
import templateService from '../services/templateService.js';
import savedTemplatesService from '../services/savedTemplatesService.js';

// Utils & Constants
import { 
  TEMPLATE_CATEGORIES, 
  LANGUAGES, 
  HEADER_TYPES,
  INITIAL_TEMPLATE_DATA,
  TEMPLATE_LIMITS
} from '../utils/templateConstants.js';
import { 
  detectParameterType, 
  extractPositionalVariables, 
  extractNamedVariables,
  validateTemplate,
  transformToAPIFormat
} from '../utils/templateHelpers.js';

const CreateTemplate = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { templateId } = useParams(); // Untuk edit mode
  const { toasts, showToast, removeToast } = useToast();
  
  // Detect mode berdasarkan URL dan params
  const isEditMode = window.location.pathname.includes('/edit-template/');
  const isFromLibrary = searchParams.get('from') === 'library' || location.state?.fromLibrary;
  
  // State
  const [loading, setLoading] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(isEdit && templateId);
  const [currentStep, setCurrentStep] = useState(
    isEditMode || isFromLibrary ? 2 : 1 // Skip category untuk edit atau from library
  );
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data dari berbagai sumber saat component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (isEditMode && templateId) {
          // Edit mode - load dari saved template
          await loadTemplateForEdit();
        } else if (isFromLibrary) {
          // From library - load dari sessionStorage atau location.state
          loadTemplateFromLibrary();
        } else {
          // Create mode biasa
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        showToast('Failed to load template data', 'error');
      }
    };

    loadInitialData();
  }, [templateId, isEditMode, isFromLibrary]);

  // Function untuk load template dari library
  const loadTemplateFromLibrary = () => {
    try {
      let libraryData = null;

      // Coba ambil dari location.state dulu
      if (location.state?.templateData) {
        libraryData = location.state.templateData;
      } 
      // Fallback ke sessionStorage
      else {
        const storedData = sessionStorage.getItem('libraryTemplateData');
        if (storedData) {
          libraryData = JSON.parse(storedData);
          // Clear sessionStorage setelah digunakan
          sessionStorage.removeItem('libraryTemplateData');
        }
      }

      if (libraryData) {
        // Modifikasi nama template untuk membedakan dari library
        const modifiedData = {
          ...libraryData,
          name: `${libraryData.name}_custom_${Date.now()}`.substring(0, 512) // Ensure name length limit
        };
        
        setTemplateData(modifiedData);
        setIsDataLoaded(true);
        
        showToast('Template loaded from library successfully!', 'success');
        
        console.log('Loaded template from library:', {
          original: libraryData,
          modified: modifiedData
        });
      } else {
        throw new Error('No template data found');
      }
    } catch (error) {
      console.error('Error loading template from library:', error);
      showToast('Failed to load template from library', 'error');
      // Redirect back to library
      navigate('/templates/library');
    }
  };

  // Function untuk transform API response ke form data (untuk edit mode)
  const transformAPIToFormData = (apiData) => {
    const transformedData = {
      name: apiData.name || '',
      category: apiData.category || '',
      language: apiData.language || 'en',
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
    };

    // Parse components dari API response
    if (Array.isArray(apiData.components)) {
      apiData.components.forEach(component => {
        switch (component.type) {
          case 'HEADER':
            transformedData.header = {
              type: component.format || 'TEXT',
              text: component.text || '',
              media_url: (component.example && component.example[0]) || '',
              media_id: ''
            };
            break;
            
          case 'BODY':
            transformedData.body.text = component.text || '';
            
            // Detect parameter type dan set examples
            const paramType = detectParameterType(component.text || '');
            transformedData.body.parameterType = paramType;
            
            // Handle examples berdasarkan format dari API
            if (paramType === 'positional') {
              if (component.example?.body_text?.[0]) {
                // Format: {"body_text": [["John", "your email"]]}
                transformedData.body.examples = component.example.body_text[0];
              } else if (Array.isArray(component.example)) {
                // Format langsung array
                transformedData.body.examples = component.example;
              }
            } else if (paramType === 'named' && component.example?.body_text_named_params) {
              transformedData.body.namedExamples = component.example.body_text_named_params;
            }
            break;
            
          case 'FOOTER':
            transformedData.footer.text = component.text || '';
            break;
            
          case 'BUTTONS':
            transformedData.buttons = component.buttons || [];
            break;
        }
      });
    }

    return transformedData;
  };

  // Function untuk load template data untuk edit
  const loadTemplateForEdit = async () => {
    setLoadingTemplate(true);
    try {
      const result = await savedTemplatesService.getTemplateById(templateId);
      
      if (result.status_code === 201 && result.data) {
        const transformedData = transformAPIToFormData(result.data);
        setTemplateData(transformedData);
        setIsDataLoaded(true);
        
        console.log('Loaded template for edit:', {
          original: result.data,
          transformed: transformedData
        });
        
      } else {
        throw new Error(result.message || 'Failed to load template');
      }
      
    } catch (error) {
      console.error('Error loading template for edit:', error);
      showToast(error.message || 'Failed to load template', 'error');
      navigate('/saved-templates');
    } finally {
      setLoadingTemplate(false);
    }
  };

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

  // Button handlers
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

  // Reset form handler
  const handleReset = () => {
    if (isFromLibrary) {
      // Jika dari library, load ulang data library
      loadTemplateFromLibrary();
    } else {
      // Reset ke initial data
      setTemplateData(INITIAL_TEMPLATE_DATA);
      setCurrentStep(isEditMode ? 2 : 1);
    }
    showToast('Form has been reset', 'info');
  };

  // Submit handler untuk create dan edit
  const handleSubmit = async () => {
    const validation = validateTemplate(templateData);
    
    if (!validation.isValid) {
      showToast(validation.error, 'error');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && templateId) {
        // Edit mode - transform untuk API edit
        const editPayload = transformToAPIFormat(templateData);
        console.log('Editing template with payload:', editPayload);
        
        const result = await savedTemplatesService.updateTemplate(templateId, editPayload);
        showToast('Template updated successfully!', 'success');
        console.log('Template updated:', result);
      } else {
        // Create mode (baik dari library maupun create biasa)
        const result = await templateService.createTemplate(templateData);
        showToast('Template submitted successfully for approval!', 'success');
        console.log('Template created:', result);
      }
      
      setTimeout(() => {
        navigate('/saved-templates');
      }, 2000);

    } catch (error) {
      console.error('Error saving template:', error);
      showToast(error.message || `Failed to ${isEditMode ? 'update' : 'create'} template`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate examples based on body text
  useEffect(() => {
    if (!isDataLoaded) return; // Skip jika data belum loaded

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
  }, [templateData.body.text, templateData.body.examples, templateData.body.namedExamples, templateData.body.parameterType, isDataLoaded]);

  // Page titles dan descriptions
  const getPageInfo = () => {
    if (isEditMode) {
      return {
        title: "Edit Template",
        description: "Modify your existing message template",
        icon: Edit
      };
    } else if (isFromLibrary) {
      return {
        title: "Customize Template",
        description: "Customize template from library for your needs",
        icon: BookOpen
      };
    } else {
      return {
        title: "Create WhatsApp Template",
        description: "Design and submit a new message template for approval",
        icon: MessageSquare
      };
    }
  };

  const pageInfo = getPageInfo();

  // Loading state untuk edit mode atau loading template
  if (loadingTemplate || !isDataLoaded) {
    return (
      <Layout title={pageInfo.title}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">
                {loadingTemplate ? 'Loading template data...' : 'Preparing template...'}
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={pageInfo.title}>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="max-w-7xl mx-auto">
        {/* Progress Header */}
        <ErrorBoundary level="component">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                {React.createElement(pageInfo.icon, { className: "w-7 h-7 text-white" })}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{pageInfo.title}</h1>
                <p className="text-gray-600 text-lg">{pageInfo.description}</p>
                {isFromLibrary && (
                  <div className="flex items-center gap-2 mt-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">Based on template library</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {(isFromLibrary || isEditMode) && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/templates/library')}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Library
                </button>
              </div>
            </div>

            {/* Progress Bar - Hide untuk edit mode dan from library */}
            {!isEditMode && !isFromLibrary && (
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
            )}
          </div>
        </ErrorBoundary>

        {/* Step 1: Category Selection - Skip untuk edit mode dan from library */}
        {!isEditMode && !isFromLibrary && currentStep === 1 && (
          <CategorySelection
            selectedCategory={templateData.category}
            onCategorySelect={(category) => handleInputChange('category', category)}
            onNext={nextStep}
            onCancel={() => navigate('/saved-templates')}
          />
        )}

        {/* Step 2: Template Builder - Show untuk edit mode, from library, atau step 2 */}
        {(isEditMode || isFromLibrary || currentStep === 2) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Selected Category Badge - Show untuk edit mode dan from library */}
              {(isEditMode || isFromLibrary) && templateData.category && (
                <ErrorBoundary level="component">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      {React.createElement(TEMPLATE_CATEGORIES.find(c => c.value === templateData.category)?.icon, { 
                        className: "w-6 h-6 text-green-600" 
                      })}
                      <div>
                        <span className="text-sm text-gray-500">Template Category:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {TEMPLATE_CATEGORIES.find(c => c.value === templateData.category)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {/* Basic Information */}
              <ErrorBoundary level="component">
                <BasicInfoForm 
                  templateData={templateData}
                  onInputChange={handleInputChange}
                />
              </ErrorBoundary>

              {/* Header Section */}
              <ErrorBoundary level="component">
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
                          {HEADER_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
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
                            maxLength={TEMPLATE_LIMITS.HEADER_TEXT_MAX_LENGTH}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <p className="mt-1 text-xs text-gray-500">{templateData.header.text.length}/{TEMPLATE_LIMITS.HEADER_TEXT_MAX_LENGTH} characters</p>
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
              </ErrorBoundary>

              {/* Body Section */}
              <ErrorBoundary level="component">
                <BodyForm 
                  templateData={templateData}
                  onInputChange={handleNestedInputChange}
                />
              </ErrorBoundary>

              {/* Footer & Buttons Section */}
              <ErrorBoundary level="component">
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
                          maxLength={TEMPLATE_LIMITS.FOOTER_TEXT_MAX_LENGTH}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-gray-500">{templateData.footer.text.length}/{TEMPLATE_LIMITS.FOOTER_TEXT_MAX_LENGTH} characters</p>
                      </div>

                      {/* Buttons */}
                      <ButtonsForm
                        buttons={templateData.buttons}
                        onAddButton={addButton}
                        onRemoveButton={removeButton}
                        onUpdateButton={updateButton}
                      />
                    </div>
                  </div>
                </details>
              </ErrorBoundary>

              {/* Navigation Buttons */}
              <ErrorBoundary level="component">
                <div className="flex justify-between items-center pt-6">
                  <button
                    onClick={() => {
                      if (isEditMode || isFromLibrary) {
                        navigate('/saved-templates');
                      } else {
                        prevStep();
                      }
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {isEditMode || isFromLibrary ? 'Cancel' : 'Back'}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {isEditMode ? 'Update Template' : 'Create Template'}
                      </>
                    )}
                  </button>
                </div>
              </ErrorBoundary>
            </div>

            {/* Live Preview Section */}
            <div className="lg:sticky lg:top-6">
              <ErrorBoundary 
                level="component"
                fallback={
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Unavailable</h3>
                    <p className="text-gray-600">Unable to load template preview.</p>
                  </div>
                }
              >
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
                      <span className="font-medium">{TEMPLATE_CATEGORIES.find(c => c.value === templateData.category)?.label || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{LANGUAGES.find(l => l.code === templateData.language)?.name}</span>
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
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-medium">
                        {isEditMode && <span className="text-blue-600">Edit Mode</span>}
                        {isFromLibrary && <span className="text-purple-600">From Library</span>}
                        {!isEditMode && !isFromLibrary && <span className="text-green-600">Create Mode</span>}
                      </span>
                    </div>
                    {templateData.body.parameterType !== 'none' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Parameters:</span>
                        <span className="font-medium">
                          {templateData.body.parameterType === 'positional' 
                            ? `${templateData.body.examples.length} positional`
                            : `${templateData.body.namedExamples.length} named`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateTemplate;