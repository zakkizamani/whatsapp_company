// src/components/get_templates/SavedTemplatesHeader.jsx
import React from 'react';
import { FileText, Plus } from 'lucide-react';

const SavedTemplatesHeader = ({ onCreateNew }) => {
  return (
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
          onClick={onCreateNew}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Create New Template
        </button>
      </div>
    </div>
  );
};

export default SavedTemplatesHeader;