// src/components/saved_templates/TemplatePreviewModal.jsx
import React from 'react';
import { XCircle, MessageSquare, ShoppingBag, Bell, Shield } from 'lucide-react';
import WhatsAppPreview from '../create_template/WhatsAppPreview.jsx';

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

const TemplatePreviewModal = ({ template, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Template Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                {React.createElement(categoryIcons[template.category] || MessageSquare, { 
                    className: "w-4 h-4" 
                  })}
                  {template.category}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {template.language.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <WhatsAppPreview {...getTemplatePreview(template.components)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;