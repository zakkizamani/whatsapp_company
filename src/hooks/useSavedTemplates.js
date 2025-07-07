// // src/hooks/useSavedTemplates.js
// import { useState, useEffect, useCallback } from 'react';
// import savedTemplatesService from '../services/savedTemplatesService';

// /**
//  * Custom hook for managing saved templates
//  */
// export const useSavedTemplates = () => {
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalItems, setTotalItems] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [filters, setFilters] = useState({
//     search: '',
//     category: 'ALL',
//     status: 'ALL',
//     sortOrder: 'desc'
//   });

//   // Fetch templates with current filters
//   const fetchTemplates = useCallback(async (page = currentPage, size = pageSize) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const params = {
//         page,
//         size,
//         order: filters.sortOrder
//       };

//       // Add filters
//       if (filters.search.trim()) {
//         params.search = filters.search.trim();
//       }
      
//       if (filters.category !== 'ALL') {
//         params.category = filters.category;
//       }
      
//       if (filters.status !== 'ALL') {
//         params.status = filters.status;
//       }

//       const result = await savedTemplatesService.getTemplates(params);
      
//       if (result.status_code === 201 && result.data) {
//         setTemplates(result.data.items || []);
//         setTotalItems(result.data.total || 0);
//         setCurrentPage(result.data.page || 1);
//         setPageSize(result.data.size || 10);
//       } else {
//         throw new Error(result.message || 'Failed to fetch templates');
//       }

//     } catch (err) {
//       setError(err.message || 'Failed to load templates');
//       setTemplates([]);
//       setTotalItems(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, pageSize, filters]);

//   // Update filters
//   const updateFilters = useCallback((newFilters) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//     setCurrentPage(1); // Reset to first page when filters change
//   }, []);

//   // Delete template
//   const deleteTemplate = useCallback(async (templateId) => {
//     try {
//       await savedTemplatesService.deleteTemplate(templateId);
//       // Refresh templates after deletion
//       await fetchTemplates();
//       return { success: true };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   }, [fetchTemplates]);

//   // Get template by ID
//   const getTemplateById = useCallback(async (templateId) => {
//     try {
//       const result = await savedTemplatesService.getTemplateById(templateId);
//       return { success: true, data: result };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   }, []);

//   // Update template
//   const updateTemplate = useCallback(async (templateId, templateData) => {
//     try {
//       const result = await savedTemplatesService.updateTemplate(templateId, templateData);
//       // Refresh templates after update
//       await fetchTemplates();
//       return { success: true, data: result };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   }, [fetchTemplates]);

//   // Duplicate template
//   const duplicateTemplate = useCallback(async (templateId, newName) => {
//     try {
//       const result = await savedTemplatesService.duplicateTemplate(templateId, newName);
//       // Refresh templates after duplication
//       await fetchTemplates();
//       return { success: true, data: result };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   }, [fetchTemplates]);

//   // Get template statistics
//   const getTemplateStats = useCallback(() => {
//     const stats = {
//       total: totalItems,
//       approved: templates.filter(t => t.status === 'APPROVED').length,
//       pending: templates.filter(t => t.status === 'PENDING').length,
//       rejected: templates.filter(t => t.status === 'REJECTED').length,
//       flagged: templates.filter(t => t.status === 'FLAGGED').length,
//       disabled: templates.filter(t => t.status === 'DISABLED').length,
//       paused: templates.filter(t => t.status === 'PAUSED').length,
//       inAppeal: templates.filter(t => t.status === 'IN_APPEAL').length,
//       reinstated: templates.filter(t => t.status === 'REINSTATED').length,
//       pendingDeletion: templates.filter(t => t.status === 'PENDING_DELETION').length
//     };
//     return stats;
//   }, [templates, totalItems]);

//   // Export templates
//   const exportTemplates = useCallback(async () => {
//     try {
//       const blob = await savedTemplatesService.exportTemplates();
      
//       // Create download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `templates_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       return { success: true };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   }, []);

//   // Bulk delete templates
//   const bulkDeleteTemplates = useCallback(async (templateIds) => {
//     try {
//       const result = await savedTemplatesService.bulkDeleteTemplates(templateIds);
//       // Refresh templates after bulk deletion
//       await fetchTemplates();
//       return { success: true, data: result };
//     } catch (err) {
//       return { success: false, error: err.message };
//     }
//   }, [fetchTemplates]);

//   // Refresh templates
//   const refreshTemplates = useCallback(() => {
//     fetchTemplates();
//   }, [fetchTemplates]);

//   // Go to page
//   const goToPage = useCallback((page) => {
//     setCurrentPage(page);
//   }, []);

//   // Change page size
//   const changePageSize = useCallback((size) => {
//     setPageSize(size);
//     setCurrentPage(1);
//   }, []);

//   // Format template preview data
//   const getTemplatePreview = useCallback((components) => {
//     const preview = {
//       header: null,
//       body: '',
//       footer: null,
//       buttons: []
//     };

//     components.forEach(component => {
//       switch (component.type) {
//         case 'HEADER':
//           if (component.format === 'TEXT') {
//             preview.header = component.text;
//           }
//           break;
//         case 'BODY':
//           preview.body = component.text;
//           break;
//         case 'FOOTER':
//           preview.footer = component.text;
//           break;
//         case 'BUTTONS':
//           preview.buttons = component.buttons || [];
//           break;
//       }
//     });

//     return preview;
//   }, []);

//   // Load templates when filters change
//   useEffect(() => {
//     fetchTemplates();
//   }, [fetchTemplates]);

//   // Calculate pagination info
//   const paginationInfo = {
//     totalPages: Math.ceil(totalItems / pageSize),
//     startItem: (currentPage - 1) * pageSize + 1,
//     endItem: Math.min(currentPage * pageSize, totalItems),
//     hasNextPage: currentPage < Math.ceil(totalItems / pageSize),
//     hasPrevPage: currentPage > 1
//   };

//   return {
//     // Data
//     templates,
//     loading,
//     error,
//     totalItems,
//     currentPage,
//     pageSize,
//     filters,
//     paginationInfo,
    
//     // Actions
//     fetchTemplates,
//     updateFilters,
//     deleteTemplate,
//     getTemplateById,
//     updateTemplate,
//     duplicateTemplate,
//     exportTemplates,
//     bulkDeleteTemplates,
//     refreshTemplates,
//     goToPage,
//     changePageSize,
    
//     // Utilities
//     getTemplateStats,
//     getTemplatePreview
//   };
// };
// src/hooks/useSavedTemplates.js
import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../utils/constants.js';
import useToast from './useToast.js';

const useSavedTemplates = () => {
  const { showToast } = useToast();
  
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

  // Calculate stats from current templates
  const getStats = useCallback((templatesArray) => {
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
  }, []);

  // Get current stats
  const currentStats = getStats(templates);

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Fetch templates from API
  const fetchTemplates = useCallback(async (page = 1, size = 10) => {
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
  }, [searchQuery, selectedCategory, selectedStatus, sortOrder, showToast]);

  // Delete template
  const deleteTemplate = useCallback(async (templateId) => {
    setDeletingTemplate(templateId);
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

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
  }, [fetchTemplates, currentPage, pageSize, showToast]);

  // Load templates on component mount and when filters change
  useEffect(() => {
    fetchTemplates(currentPage, pageSize);
  }, [currentPage, pageSize, sortOrder, selectedCategory, selectedStatus, fetchTemplates]);

  // Search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery !== '') {
        setCurrentPage(1);
        fetchTemplates(1, pageSize);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, fetchTemplates, pageSize]);

  // Handlers
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query === '') {
      setCurrentPage(1);
      fetchTemplates(1, pageSize);
    }
  }, [fetchTemplates, pageSize]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleStatusChange = useCallback((status) => {
    setSelectedStatus(status);
  }, []);

  const handleSortChange = useCallback((order) => {
    setSortOrder(order);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    setSelectedTemplate(null);
  }, []);

  const handleDelete = useCallback((templateId) => {
    deleteTemplate(templateId);
  }, [deleteTemplate]);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedTemplate(null);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchTemplates(currentPage, pageSize);
  }, [fetchTemplates, currentPage, pageSize]);

  return {
    // State
    templates,
    loading,
    searchQuery,
    selectedCategory,
    selectedStatus,
    currentPage,
    pageSize,
    totalItems,
    sortOrder,
    selectedTemplate,
    showPreview,
    showDeleteModal,
    deletingTemplate,
    
    // Computed
    currentStats,
    totalPages,
    startItem,
    endItem,
    
    // Handlers
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleSortChange,
    handlePageChange,
    handlePreview,
    handleClosePreview,
    handleDelete,
    handleCloseDeleteModal,
    handleRefresh,
    
    // Direct setters for complex operations
    setSelectedTemplate,
    setShowDeleteModal,
    setShowPreview
  };
};

export default useSavedTemplates;