// src/components/saved_templates/SavedTemplatesTable.jsx - Fixed Edit Handler
import React from 'react';
import { 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft,
  ChevronRight,
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
  Loader2,
  Plus
} from 'lucide-react';

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
    icon: RotateCcw, 
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

// Get template preview data
const getTemplatePreview = (components) => {
  const preview = {
    header: null,
    body: '',
    footer: null,
    buttons: []
  };

  if (!components || !Array.isArray(components)) {
    return preview;
  }

  components.forEach(component => {
    switch (component.type) {
      case 'HEADER':
        if (component.format === 'TEXT') {
          preview.header = component.text;
        }
        break;
      case 'BODY':
        preview.body = component.text || '';
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

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '-';
  }
};

const SavedTemplatesTable = ({
  templates,
  loading,
  searchQuery,
  selectedCategory,
  selectedStatus,
  deletingTemplate,
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPreview,
  onEdit,
  onDelete,
  onPageChange,
  onCreateNew
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
            onClick={onCreateNew}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 font-medium mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
                <tr 
                  key={template._id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    deletingTemplate === template._id ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {preview.body && preview.body.length > 50 
                            ? `${preview.body.substring(0, 50)}...` 
                            : preview.body || 'No content'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {template.category ? template.category.toLowerCase() : 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[template.status]?.bgColor || 'bg-gray-50'} ${statusConfig[template.status]?.color || 'text-gray-600'} ${statusConfig[template.status]?.borderColor || 'border-gray-200'}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[template.status]?.label || template.status || 'Unknown'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900 uppercase font-mono">
                      {template.language || 'en'}
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
                        onClick={() => onPreview(template)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          console.log('Edit button clicked for template:', template._id);
                          onEdit(template._id);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(template)}
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
      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {startItem} to {endItem} of {totalItems} templates
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => onPageChange(1)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="px-2 py-2 text-sm text-gray-500">...</span>
                    )}
                  </>
                )}
                
                {/* Current page and neighbors */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(currentPage - 2 + i, totalPages));
                  if (page < Math.max(1, currentPage - 2) || page > Math.min(totalPages, currentPage + 2)) {
                    return null;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                        page === currentPage
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 py-2 text-sm text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedTemplatesTable;