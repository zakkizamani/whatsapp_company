// src/pages/SavedTemplates.jsx - Refactored
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Layout from '../components/Layout.jsx';
import ToastContainer from '../components/ToastContainer.jsx';
import SavedTemplatesHeader from '../components/get_templates/SavedTemplatesHeader.jsx';
import SavedTemplatesStats from '../components/get_templates/SavedTemplatesStats.jsx';
import SavedTemplatesFilters from '../components/get_templates/SavedTemplatesFilters.jsx';
import SavedTemplatesTable from '../components/get_templates/SavedTemplatesTable.jsx';
import TemplatePreviewModal from '../components/get_templates/TemplatePreviewModal.jsx';
import DeleteConfirmationModal from '../components/get_templates/DeleteConfirmationModal.jsx';

// Hooks & Services
import useToast from '../hooks/useToast.js';
import useSavedTemplates from '../hooks/useSavedTemplates.js';

const SavedTemplates = () => {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  
  // Custom hook untuk mengelola saved templates
  const {
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
    currentStats,
    totalPages,
    startItem,
    endItem,
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
    setSelectedTemplate,
    setShowDeleteModal
  } = useSavedTemplates();

  return (
    <Layout title="Saved Templates">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <SavedTemplatesHeader onCreateNew={() => navigate('/templates/create')} />

        {/* Stats Cards */}
        <SavedTemplatesStats stats={currentStats} />

        {/* Filters */}
        <SavedTemplatesFilters
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          sortOrder={sortOrder}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
          onRefresh={handleRefresh}
        />

        {/* Templates Table */}
        <SavedTemplatesTable
          templates={templates}
          loading={loading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          deletingTemplate={deletingTemplate}
          currentPage={currentPage}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          totalItems={totalItems}
          onPreview={(template) => {
            setSelectedTemplate(template);
            handlePreview();
          }}
          onEdit={(templateId) => navigate(`/templates/edit-template/${templateId}`)}
          onDelete={(template) => {
            setSelectedTemplate(template);
            setShowDeleteModal(true);
          }}
          onPageChange={handlePageChange}
          onCreateNew={() => navigate('/create-template')}
        />

        {/* Preview Modal */}
        {showPreview && selectedTemplate && (
          <TemplatePreviewModal
            template={selectedTemplate}
            onClose={handleClosePreview}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedTemplate && (
          <DeleteConfirmationModal
            template={selectedTemplate}
            isDeleting={deletingTemplate === selectedTemplate._id}
            onConfirm={() => handleDelete(selectedTemplate._id)}
            onCancel={handleCloseDeleteModal}
          />
        )}
      </div>
    </Layout>
  );
};

export default SavedTemplates;