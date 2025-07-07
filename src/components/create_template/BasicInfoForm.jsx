// src/components/template/BasicInfoForm.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { LANGUAGES } from '../../utils/templateConstants';

const BasicInfoForm = ({ 
  templateData, 
  onInputChange 
}) => {
  const handleNameChange = (value) => {
    // Sanitize the template name
    const sanitizedName = value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    onInputChange('name', sanitizedName);
  };

  return (
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
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., welcome_message_v1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Use lowercase letters, numbers, and underscores only
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language <span className="text-red-500">*</span>
          </label>
          <select
            value={templateData.language}
            onChange={(e) => onInputChange('language', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;