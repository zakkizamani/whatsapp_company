// src/pages/TemplateLibrary.jsx - Enhanced dengan Use Template Integration
import { useState, useEffect } from 'react';
import { Search, MessageSquare, Filter, Copy, Eye, Send, Download, ChevronDown, Clock, CheckCheck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { CONFIG } from '../utils/constants';
import bgCard from '../assets/bg_template_library.png';

// Template Card Component with its own error boundary
const TemplateCard = ({ template, onPreview, onUseTemplate, bgCard }) => {
  return (
    <ErrorBoundary 
      level="component" 
      fallback={
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <MessageSquare className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 text-sm">Failed to load template</p>
        </div>
      }
    >
      <div className="group">
        <div 
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-1"
          style={{ 
            backgroundImage: bgCard ? `url(${bgCard})` : '',
            backgroundColor: bgCard ? 'transparent' : '#f5f5dc',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {template.name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-green-100">
                    <Clock className="w-3 h-3" />
                    <span>Template Message</span>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                {template.category}
              </span>
            </div>
          </div>

          <div className="p-5">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                {template.topic?.replace(/_/g, ' ')}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700">
                {template.usecase?.replace(/_/g, ' ').substring(0, 15)}
                {template.usecase?.length > 15 && '...'}
              </span>
              {template.industry?.slice(0, 1).map((ind, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-50 text-orange-700">
                  {ind.replace(/_/g, ' ')}
                </span>
              ))}
              {template.industry?.length > 1 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  +{template.industry.length - 1}
                </span>
              )}
            </div>

            {/* Message Preview */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 mb-4 relative">
              <div className="absolute -left-2 top-4 w-0 h-0 border-t-[16px] border-t-transparent border-r-[16px] border-r-green-50 border-b-[16px] border-b-transparent"></div>
              
              {template.header && (
                <div className="font-bold text-gray-900 mb-2 text-sm">
                  {template.header}
                </div>
              )}
              <div className="text-sm text-gray-700 leading-relaxed">
                <div className="line-clamp-3">
                  {formatTemplateBody(template.body, template.body_params).substring(0, 150)}
                  {template.body.length > 150 && '...'}
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-1 mt-2 text-xs text-gray-500">
                <span>Template</span>
                <CheckCheck className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            
            {/* Buttons preview */}
            {template.buttons && template.buttons.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2 font-medium">Quick Actions:</div>
                <div className="flex flex-wrap gap-2">
                  {template.buttons.slice(0, 2).map((button, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                      {button.type === 'URL' && '🔗 '}
                      {button.type === 'PHONE_NUMBER' && '📞 '}
                      {button.text}
                    </span>
                  ))}
                  {template.buttons.length > 2 && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-gray-50 text-gray-500">
                      +{template.buttons.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => onPreview(template)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm bg-gradient-to-l from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => onUseTemplate(template)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Format template body helper function
const formatTemplateBody = (body, params) => {
  if (!params) return body;
  
  let formattedBody = body;
  params.forEach((param, index) => {
    const placeholder = `{{${index + 1}}}`;
    formattedBody = formattedBody.replace(new RegExp(placeholder, 'g'), `**${param}**`);
  });
  
  return formattedBody;
};

const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const hasBackground = bgCard;

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    topic: '',
    usecase: '',
    industry: '',
    language: 'id'
  });

  // Filter options
  const topics = [
    'ACCOUNT_UPDATES',
    'CUSTOMER_FEEDBACK', 
    'ORDER_MANAGEMENT',
    'PAYMENTS',
    'EVENT_REMINDER',
    'IDENTITY_VERIFICATION'
  ];

  const usecases = [
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

  const industries = [
    'E_COMMERCE',
    'FINANCIAL_SERVICES'
  ];

  // Fetch templates from API
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim()) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(
        `${CONFIG.API_BASE_URL}/notification-gateway/template/library?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.data?.data || []);
        setFilteredTemplates(data.data?.data || []);
      } else {
        console.error('Failed to fetch templates');
        setSampleData();
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  // Fetch template detail by ID
  const fetchTemplateDetail = async (templateId) => {
    setLoadingDetail(true);
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/notification-gateway/template/library/${templateId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        throw new Error('Failed to fetch template detail');
      }
    } catch (error) {
      console.error('Error fetching template detail:', error);
      throw error;
    } finally {
      setLoadingDetail(false);
    }
  };

  // Transform library template to create template format
  const transformLibraryToCreateFormat = (libraryTemplate) => {
    const transformedData = {
      name: libraryTemplate.name || '',
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
      // Detect parameter type from body text
      const positionalRegex = /\{\{(\d+)\}\}/g;
      const namedRegex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
      
      const positionalMatches = [...libraryTemplate.body.matchAll(positionalRegex)];
      const namedMatches = [...libraryTemplate.body.matchAll(namedRegex)];
      
      if (positionalMatches.length > 0) {
        // Positional parameters
        transformedData.body.parameterType = 'positional';
        transformedData.body.examples = libraryTemplate.body_params;
      } else if (namedMatches.length > 0) {
        // Named parameters
        transformedData.body.parameterType = 'named';
        const namedVariables = namedMatches.map(match => match[1]);
        transformedData.body.namedExamples = namedVariables.map((varName, index) => ({
          param_name: varName,
          example: libraryTemplate.body_params[index] || ''
        }));
      }
    }

    return transformedData;
  };

  // Set sample data for demo
  const setSampleData = () => {
    const sampleTemplates = [
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
    setTemplates(sampleTemplates);
    setFilteredTemplates(sampleTemplates);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  useEffect(() => {
    let filtered = templates;

    if (filters.search) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        template.body.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.topic) {
      filtered = filtered.filter(template => template.topic === filters.topic);
    }

    if (filters.usecase) {
      filtered = filtered.filter(template => template.usecase === filters.usecase);
    }

    if (filters.industry) {
      filtered = filtered.filter(template => 
        template.industry.includes(filters.industry)
      );
    }

    setFilteredTemplates(filtered);
  }, [filters, templates]);

  // Load templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle template preview
  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  // Handle template use - Navigate to create template with data
  const handleUseTemplate = async (template) => {
    try {
      // Fetch full template detail first
      const fullTemplate = await fetchTemplateDetail(template.id);
      
      // Transform to create template format
      const transformedData = transformLibraryToCreateFormat(fullTemplate);
      
      // Store in sessionStorage untuk transfer data
      sessionStorage.setItem('libraryTemplateData', JSON.stringify(transformedData));
      
      // Navigate to create template page with flag
      navigate('/templates/create?from=library', { 
        state: { 
          templateData: transformedData,
          fromLibrary: true 
        }
      });
      
    } catch (error) {
      console.error('Error using template:', error);
      alert('Failed to load template data. Please try again.');
    }
  };

  return (
    <Layout title="Template Library">
      <div className="relative z-10">
        {/* Header */}
        <ErrorBoundary 
          level="component"
          fallback={
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <p className="text-red-600">Failed to load page header</p>
            </div>
          }
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">WhatsApp Template Library</h1>
                <p className="text-gray-600 text-lg">Browse dan pilih template yang sesuai untuk bisnis Anda</p>
              </div>
              <button
                onClick={() => navigate('/templates/create')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Template
              </button>
            </div>

            {/* Search and Filters */}
            <ErrorBoundary 
              level="component"
              fallback={
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-yellow-700">Search filters temporarily unavailable</p>
                </div>
              }
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari template..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Topic Filter */}
                  <div>
                    <select
                      value={filters.topic}
                      onChange={(e) => handleFilterChange('topic', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Topics</option>
                      {topics.map(topic => (
                        <option key={topic} value={topic}>{topic.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Usecase Filter */}
                  <div>
                    <select
                      value={filters.usecase}
                      onChange={(e) => handleFilterChange('usecase', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Use Cases</option>
                      {usecases.map(usecase => (
                        <option key={usecase} value={usecase}>
                          {usecase.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Industry Filter */}
                  <div>
                    <select
                      value={filters.industry}
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Industries</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Button */}
                  <div>
                    <button
                      onClick={fetchTemplates}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      Cari
                    </button>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </ErrorBoundary>

        {/* Loading Detail Overlay */}
        {loadingDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading template data...</p>
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <ErrorBoundary 
          level="component"
          fallback={
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <MessageSquare className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load templates</h3>
              <p className="text-red-600 mb-4">There was an error loading the template library.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reload Page
              </button>
            </div>
          }
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Memuat template...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={handlePreview}
                  onUseTemplate={handleUseTemplate}
                  bgCard={bgCard}
                />
              ))}
            </div>
          )}
        </ErrorBoundary>

        {/* No Results */}
        {!loading && filteredTemplates.length === 0 && (
          <ErrorBoundary 
            level="component"
            fallback={
              <div className="text-center py-16">
                <p className="text-gray-600">Error loading search results</p>
              </div>
            }
          >
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Tidak ada template ditemukan</h3>
              <p className="text-gray-600 text-lg">Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
          </ErrorBoundary>
        )}

        {/* Template Preview Modal */}
        {showPreview && selectedTemplate && (
          <ErrorBoundary 
            level="component"
            fallback={
              <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-6 max-w-md">
                  <h3 className="text-lg font-semibold mb-2">Preview Error</h3>
                  <p className="text-gray-600 mb-4">Failed to load template preview</p>
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            }
          >
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Template Preview</h3>
                        <p className="text-sm text-green-100 mt-1">WhatsApp Business Message Template</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                  {/* Template Info */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      {selectedTemplate.name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {selectedTemplate.topic?.replace(/_/g, ' ')}
                      </span>
                      <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {selectedTemplate.usecase?.replace(/_/g, ' ')}
                      </span>
                      {selectedTemplate.industry?.map((ind, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                          {ind.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* WhatsApp Message Preview */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3 text-lg">Message Preview</h5>
                      <div 
                        className="rounded-xl p-4"
                        style={{
                          backgroundColor: '#e3ddd3',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      >
                        <div className="bg-white rounded-2xl p-4 max-w-sm shadow-sm relative">
                          <div className="absolute -left-2 top-4 w-0 h-0 border-t-[16px] border-t-transparent border-r-[16px] border-r-white border-b-[16px] border-b-transparent"></div>
                          
                          {selectedTemplate.header && (
                            <div className="font-bold text-gray-900 mb-3 text-base leading-relaxed">
                              {selectedTemplate.header}
                            </div>
                          )}
                          
                          <div className="text-gray-800 whitespace-pre-line mb-4 text-sm leading-relaxed">
                            {formatTemplateBody(selectedTemplate.body, selectedTemplate.body_params)}
                          </div>

                          {selectedTemplate.footer && (
                            <div className="text-xs text-gray-500 mb-4 italic">
                              {selectedTemplate.footer}
                            </div>
                          )}

                          <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                            <span>10:30 AM</span>
                            <CheckCheck className="w-4 h-4 text-blue-500" />
                          </div>

                          {selectedTemplate.buttons && selectedTemplate.buttons.length > 0 && (
                            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                              {selectedTemplate.buttons.map((button, idx) => (
                                <div key={idx} className="flex items-center justify-center py-2.5 px-4 border-2 border-green-500 text-green-600 rounded-full text-sm font-medium hover:bg-green-50 transition-colors cursor-pointer">
                                  {button.type === 'URL' && '🔗 '}
                                  {button.type === 'PHONE_NUMBER' && '📞 '}
                                  {button.text}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Parameters */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3 text-lg">Template Parameters</h5>
                      {selectedTemplate.body_params && selectedTemplate.body_params.length > 0 ? (
                        <div className="space-y-3">
                          {selectedTemplate.body_params.map((param, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center gap-3 text-sm">
                                <span className="font-mono bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold text-xs">
                                  {`{{${idx + 1}}}`}
                                </span>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{param}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    Type: <span className="font-medium">{selectedTemplate.body_param_types?.[idx] || 'TEXT'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No parameters required for this template</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleUseTemplate(selectedTemplate)}
                      disabled={loadingDetail}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingDetail ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Use This Template
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedTemplate.body)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2 font-medium hover:border-gray-400"
                    >
                      <Copy className="w-5 h-5" />
                      Copy Text
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}
      </div>
    </Layout>
  );
};

export default TemplateLibrary;