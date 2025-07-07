// src/components/template/ButtonsForm.jsx
import React, { useState } from 'react';
import { Plus, ChevronDown, Trash2 } from 'lucide-react';
import { BUTTON_TYPES, TEMPLATE_LIMITS } from '../../utils/templateConstants';

const ButtonsForm = ({ 
  buttons, 
  onAddButton, 
  onRemoveButton, 
  onUpdateButton 
}) => {
  const [showButtonDropdown, setShowButtonDropdown] = useState(false);

  const createNewButton = (type) => {
    const newButton = {
      type: type,
      text: '',
      ...(type === 'PHONE_NUMBER' && { phone_number: '' }),
      ...(type === 'URL' && { url: '' }),
      ...(type === 'COPY_CODE' && { example: '' }),
      ...(type === 'FLOW' && { 
        flow_id: '', 
        flow_name: '', 
        flow_json: '', 
        flow_action: 'navigate', 
        navigate_screen: 'FIRST_ENTRY_SCREEN' 
      })
    };

    onAddButton(newButton);
    setShowButtonDropdown(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Action Buttons
      </label>
      
      {/* Existing Buttons */}
      <div className="space-y-3 mb-4">
        {buttons.map((button, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {React.createElement(BUTTON_TYPES[button.type].icon, { 
                  className: "w-4 h-4 text-gray-600" 
                })}
                <span className="text-sm font-medium text-gray-700">
                  {BUTTON_TYPES[button.type].label}
                </span>
              </div>
              <button
                onClick={() => onRemoveButton(index)}
                className="text-red-500 hover:text-red-700 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={button.text}
                onChange={(e) => onUpdateButton(index, 'text', e.target.value)}
                placeholder="Button text"
                maxLength={TEMPLATE_LIMITS.BUTTON_TEXT_MAX_LENGTH}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />

              {button.type === 'URL' && (
                <input
                  type="url"
                  value={button.url}
                  onChange={(e) => onUpdateButton(index, 'url', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              )}

              {button.type === 'PHONE_NUMBER' && (
                <input
                  type="tel"
                  value={button.phone_number}
                  onChange={(e) => onUpdateButton(index, 'phone_number', e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              )}

              {button.type === 'COPY_CODE' && (
                <input
                  type="text"
                  value={button.example}
                  onChange={(e) => onUpdateButton(index, 'example', e.target.value)}
                  placeholder="Example code"
                  maxLength={TEMPLATE_LIMITS.COPY_CODE_MAX_LENGTH}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              )}

              {button.type === 'FLOW' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={button.flow_id}
                    onChange={(e) => onUpdateButton(index, 'flow_id', e.target.value)}
                    placeholder="Flow ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="text"
                    value={button.flow_name}
                    onChange={(e) => onUpdateButton(index, 'flow_name', e.target.value)}
                    placeholder="Flow Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {buttons.length < TEMPLATE_LIMITS.MAX_BUTTONS && (
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            onClick={() => setShowButtonDropdown(!showButtonDropdown)}
          >
            <Plus className="w-4 h-4" />
            Add Button
            <ChevronDown className="w-4 h-4" />
          </button>

          {showButtonDropdown && (
            <div className="top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
              {Object.entries(BUTTON_TYPES).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => createNewButton(type)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0 transition-colors"
                >
                  {React.createElement(config.icon, { 
                    className: "w-4 h-4 text-gray-600" 
                  })}
                  <span className="text-sm text-gray-700">{config.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        You can add up to {TEMPLATE_LIMITS.MAX_BUTTONS} buttons
      </p>
    </div>
  );
};

export default ButtonsForm;