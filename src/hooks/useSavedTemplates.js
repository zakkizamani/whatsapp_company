// src/hooks/useSavedTemplates.js
import { useState, useEffect, useCallback } from 'react';
import savedTemplatesService from '../services/savedTemplatesService';

/**
 * Custom hook for managing saved templates
 */
export const useSavedTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    category: 'ALL',
    status: 'ALL',
    sortOrder: 'desc'
  });

  // Fetch templates with current filters
  const fetchTemplates = useCallback(async (page = currentPage, size = pageSize) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        size,
        order: filters.sortOrder
      };

      // Add filters
      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }
      
      if (filters.category !== 'ALL') {
        params.category = filters.category;
      }
      
      if (filters.status !== 'ALL') {
        params.status = filters.status;
      }

      const result = await savedTemplatesService.getTemplates(params);
      
      if (result.status_code === 201 && result.data) {
        setTemplates(result.data.items || []);
        setTotalItems(result.data.total || 0);
        setCurrentPage(result.data.page || 1);
        setPageSize(result.data.size || 10);
      } else {
        throw new Error(result.message || 'Failed to fetch templates');
      }

    } catch (err) {
      setError(err.message || 'Failed to load templates');
      setTemplates([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Delete template
  const deleteTemplate = useCallback(async (templateId) => {
    try {
      await savedTemplatesService.deleteTemplate(templateId);
      // Refresh templates after deletion
      await fetchTemplates();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchTemplates]);

  // Get template by ID
  const getTemplateById = useCallback(async (templateId) => {
    try {
      const result = await savedTemplatesService.getTemplateById(templateId);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Update template
  const updateTemplate = useCallback(async (templateId, templateData) => {
    try {
      const result = await savedTemplatesService.updateTemplate(templateId, templateData);
      // Refresh templates after update
      await fetchTemplates();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchTemplates]);

  // Duplicate template
  const duplicateTemplate = useCallback(async (templateId, newName) => {
    try {
      const result = await savedTemplatesService.duplicateTemplate(templateId, newName);
      // Refresh templates after duplication
      await fetchTemplates();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchTemplates]);

  // Get template statistics
  const getTemplateStats = useCallback(() => {
    const stats = {
      total: totalItems,
      approved: templates.filter(t => t.status === 'APPROVED').length,
      pending: templates.filter(t => t.status === 'PENDING').length,
      rejected: templates.filter(t => t.status === 'REJECTED').length,
      flagged: templates.filter(t => t.status === 'FLAGGED').length,
      disabled: templates.filter(t => t.status === 'DISABLED').length,
      paused: templates.filter(t => t.status === 'PAUSED').length,
      inAppeal: templates.filter(t => t.status === 'IN_APPEAL').length,
      reinstated: templates.filter(t => t.status === 'REINSTATED').length,
      pendingDeletion: templates.filter(t => t.status === 'PENDING_DELETION').length
    };
    return stats;
  }, [templates, totalItems]);

  // Export templates
  const exportTemplates = useCallback(async () => {
    try {
      const blob = await savedTemplatesService.exportTemplates();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `templates_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Bulk delete templates
  const bulkDeleteTemplates = useCallback(async (templateIds) => {
    try {
      const result = await savedTemplatesService.bulkDeleteTemplates(templateIds);
      // Refresh templates after bulk deletion
      await fetchTemplates();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchTemplates]);

  // Refresh templates
  const refreshTemplates = useCallback(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Go to page
  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Change page size
  const changePageSize = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // Format template preview data
  const getTemplatePreview = useCallback((components) => {
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
  }, []);

  // Load templates when filters change
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Calculate pagination info
  const paginationInfo = {
    totalPages: Math.ceil(totalItems / pageSize),
    startItem: (currentPage - 1) * pageSize + 1,
    endItem: Math.min(currentPage * pageSize, totalItems),
    hasNextPage: currentPage < Math.ceil(totalItems / pageSize),
    hasPrevPage: currentPage > 1
  };

  return {
    // Data
    templates,
    loading,
    error,
    totalItems,
    currentPage,
    pageSize,
    filters,
    paginationInfo,
    
    // Actions
    fetchTemplates,
    updateFilters,
    deleteTemplate,
    getTemplateById,
    updateTemplate,
    duplicateTemplate,
    exportTemplates,
    bulkDeleteTemplates,
    refreshTemplates,
    goToPage,
    changePageSize,
    
    // Utilities
    getTemplateStats,
    getTemplatePreview
  };
};