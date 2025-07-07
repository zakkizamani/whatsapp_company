// src/pages/SavedTemplates.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Calendar,
  MessageSquare,
  ShoppingBag,
  Bell,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Pause,
  Ban,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
import Layout from '../components/Layout.jsx';
import ToastContainer from '../components/ToastContainer.jsx';
import WhatsAppPreview from '../components/create_template/WhatsAppPreview.jsx';

// Hooks & Services
import useToast from '../hooks/useToast.js';
import { CONFIG } from '../utils/constants.js';

const SavedTemplates = () => {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  
  // State
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTemplate, setDeletingTemplate] = useState(null);

  // Status configuration
  const statusConfig = {
    APPROVED: { 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      label: 'Approved' 
    },
    REJECTED: { 
      icon: XCircle, 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      label: 'Rejected' 
    },
    FLAGGED: { 
      icon: AlertTriangle, 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      label: 'Flagged' 
    },
    PAUSED: { 
      icon: Pause, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50', 
      borderColor: 'border-gray-200',
      label: 'Paused' 
    },
    PENDING_DELETION: { 
      icon: Trash2, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-200',
      label: 'Pending Deletion' 
    },
    DISABLED: { 
      icon: Ban, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50', 
      borderColor: 'border-gray-200',
      label: 'Disabled' 
    },
    IN_APPEAL: { 
      icon: RotateCcw, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      label: 'In Appeal' 
    },
    PENDING: { 
      icon: Clock, 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      label: 'Pending' 
    },
    REINSTATED: { 
      icon: RefreshCw, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      label: 'Reinstated' 
    }
  };

  // Category icons
  const categoryIcons = {
    MARKETING: ShoppingBag,
    UTILITY: Bell,
    AUTHENTICATION: Shield
  };

  // Fetch templates from API
  const fetchTemplates = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const url = new URL(`${CONFIG.API_BASE_URL}/notification-gateway/template/find`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', size.toString());
      url.searchParams.append('order', sortOrder);
      
      // Add search filter
      if (searchQuery.trim()) {
        url.searchParams.append('search', searchQuery.trim());
      }
      
      // Add category filter
      if (selectedCategory !== 'ALL') {
        url.searchParams.append('category', selectedCategory);
      }
      
      // Add status filter
      if (selectedStatus !== 'ALL') {
        url.searchParams.append('status', selectedStatus);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status_code === 201 && result.data) {
        setTemplates(result.data.items || []);
        setTotalItems(result.data.total || 0);
        setCurrentPage(result.data.page || 1);
        setPageSize(result.data.size || 10);
      } else {
        throw new Error(result.message || 'Failed to fetch templates');
      }

    } catch (error) {
      console.error('Error fetching templates:', error);
      showToast(error.message || 'Failed to load templates', 'error');
      setTemplates([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Delete template - Updated to use correct endpoint
  const deleteTemplate = async (templateId) => {
    setDeletingTemplate(templateId);
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Updated URL to match the curl command: /notification-gateway/template/delete/<templateId>
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.DELETE_TEMPLATE}/${templateId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Check if the response indicates success
      if (result.status_code && result.status_code !== 200 && result.status_code !== 201) {
        throw new Error(result.message || 'Failed to delete template');
      }

      showToast('Template deleted successfully', 'success');
      setShowDeleteModal(false);
      setDeletingTemplate(null);
      
      // Update templates array immediately for instant UI update
      setTemplates(prev => prev.filter(template => template._id !== templateId));
      setTotalItems(prev => prev - 1);
      
      // Also refresh from server to ensure data consistency
      fetchTemplates(currentPage, pageSize);

    } catch (error) {
      console.error('Error deleting template:', error);
      showToast(error.message || 'Failed to delete template', 'error');
      setDeletingTemplate(null);
    }
  };

  // Load templates on component mount and when filters change
  useEffect(() => {
    fetchTemplates(currentPage, pageSize);
  }, [currentPage, pageSize, sortOrder, selectedCategory, selectedStatus]);

  // Search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery !== '') {
        setCurrentPage(1);
        fetchTemplates(1, pageSize);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setCurrentPage(1);
      fetchTemplates(1, pageSize);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get template preview data
  const getTemplatePreview = (components) => {
    const preview = {
      header: null,
      body: '',
      footer: null,
      buttons: []
    };

    components.forEach(component => {
      switch (component.type) {
        case 'HEADER':
          if (component.format === 'TEXT') {
            preview.header = component.text;
          }
          break;
        case 'BODY':
          preview.body = component.text;
          break;
        case 'FOOTER':
          preview.footer = component.text;
          break;
        case 'BUTTONS':
          preview.buttons = component.buttons || [];
          break;
      }
    });

    return preview;
  };

  // Calculate stats from current templates
  const getStats = (templatesArray) => {
    return {
      total: templatesArray.length,
      approved: templatesArray.filter(t => t.status === 'APPROVED').length,
      pending: templatesArray.filter(t => t.status === 'PENDING').length,
      rejected: templatesArray.filter(t => t.status === 'REJECTED').length,
      flagged: templatesArray.filter(t => t.status === 'FLAGGED').length,
      disabled: templatesArray.filter(t => t.status === 'DISABLED').length,
      paused: templatesArray.filter(t => t.status === 'PAUSED').length,
      inAppeal: templatesArray.filter(t => t.status === 'IN_APPEAL').length,
      reinstated: templatesArray.filter(t => t.status === 'REINSTATED').length,
      pendingDeletion: templatesArray.filter(t => t.status === 'PENDING_DELETION').length
    };
  };

  // Get current stats
  const currentStats = getStats(templates);

  // Calculate pagination - MOVED HERE (outside of useEffect)
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <Layout title="Saved Templates">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Saved Templates</h1>
                <p className="text-gray-600 text-lg">Manage your WhatsApp message templates</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/templates/create')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create New Template
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Templates</p>
                  <p className="text-2xl font-bold">{currentStats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold">{currentStats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{currentStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Rejected</p>
                  <p className="text-2xl font-bold">{currentStats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates by name..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Categories</option>
                <option value="MARKETING">Marketing</option>
                <option value="UTILITY">Utility</option>
                <option value="AUTHENTICATION">Authentication</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="FLAGGED">Flagged</option>
                <option value="PAUSED">Paused</option>
                <option value="DISABLED">Disabled</option>
                <option value="IN_APPEAL">In Appeal</option>
                <option value="REINSTATED">Reinstated</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={() => fetchTemplates(currentPage, pageSize)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading templates...</p>
              </div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' 
                  ? 'Try adjusting your filters or search query.'
                  : 'Get started by creating your first template.'
                }
              </p>
              <button
                onClick={() => navigate('/create-template')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 font-medium mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create Template
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Template</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Language</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {templates.map((template) => {
                      const StatusIcon = statusConfig[template.status]?.icon || AlertTriangle;
                      const CategoryIcon = categoryIcons[template.category] || MessageSquare;
                      const preview = getTemplatePreview(template.components);
                      
                      return (
                        <tr key={template._id} className={`hover:bg-gray-50 transition-colors ${deletingTemplate === template._id ? 'opacity-50 pointer-events-none' : ''}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                <MessageSquare className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                <p className="text-sm text-gray-600 truncate max-w-xs">
                                  {preview.body.length > 50 ? `${preview.body.substring(0, 50)}...` : preview.body}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {template.category.toLowerCase()}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[template.status]?.bgColor} ${statusConfig[template.status]?.color} ${statusConfig[template.status]?.borderColor}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[template.status]?.label || template.status}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-900 uppercase font-mono">
                              {template.language}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {formatDate(template.createdTime)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  setShowPreview(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/edit-template/${template._id}`)}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      Showing {startItem} to {endItem} of {totalItems} templates
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Template Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTemplate.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {React.createElement(categoryIcons[selectedTemplate.category] || MessageSquare, { 
                          className: "w-4 h-4" 
                        })}
                        {selectedTemplate.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {selectedTemplate.language.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <WhatsAppPreview {...getTemplatePreview(selectedTemplate.components)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Delete Template</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "<strong>{selectedTemplate.name}</strong>"? 
                  This action cannot be undone.
                </p>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteTemplate(selectedTemplate._id)}
                    disabled={deletingTemplate === selectedTemplate._id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deletingTemplate === selectedTemplate._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedTemplates;