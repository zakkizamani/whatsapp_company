// src/components/CategorySelection.jsx
import React from 'react';
import { Eye, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { TEMPLATE_CATEGORIES } from '../../utils/templateConstants';
import WhatsAppPreview from './WhatsAppPreview';

const CategorySelection = ({ 
  selectedCategory, 
  onCategorySelect, 
  onNext, 
  onCancel 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template Category</h2>
        <p className="text-gray-600 text-lg">Select the type of message you want to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TEMPLATE_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.value;
          
          return (
            <div key={category.value} className="group">
              <div
                onClick={() => onCategorySelect(category.value)}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isSelected ? 'ring-4 ring-green-200' : ''
                }`}
              >
                {/* Category Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Header with Gradient */}
                  <div className={`bg-gradient-to-r ${category.gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8" />
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.label}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>

                  {/* Preview Section */}
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview Example
                    </h4>
                    
                    <WhatsAppPreview 
                      header={category.example.header}
                      body={category.example.body}
                      footer={category.example.footer}
                      buttons={category.example.buttons}
                    />
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>

        <button
          onClick={onNext}
          disabled={!selectedCategory}
          className={`px-8 py-3 rounded-lg transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg ${
            selectedCategory
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CategorySelection;