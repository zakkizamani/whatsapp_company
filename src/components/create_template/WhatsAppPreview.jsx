// src/components/WhatsAppPreview.jsx
import React from 'react';
import { Clock, CheckCheck } from 'lucide-react';
import { formatTextWithExamples } from '../../utils/templateHelpers';

const WhatsAppPreview = ({ 
  header, 
  body, 
  footer, 
  buttons = [], 
  examples = [], 
  namedExamples = [] 
}) => {
  return (
    <div 
      className="rounded-xl p-4"
      style={{
        backgroundColor: '#e3ddd3',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="bg-white rounded-2xl p-4 max-w-sm shadow-lg relative">
        {/* Message bubble arrow */}
        <div className="absolute -left-2 top-4 w-0 h-0 border-t-[16px] border-t-transparent border-r-[16px] border-r-white border-b-[16px] border-b-transparent"></div>
        
        {/* Header */}
        {header && (
          <div className="font-bold text-gray-900 mb-3 text-base">
            {header}
          </div>
        )}

        {/* Body */}
        <div className="mb-3 text-gray-800 text-sm leading-relaxed">
          {(examples.length > 0 || namedExamples.length > 0) ? (
            <div dangerouslySetInnerHTML={{ 
              __html: formatTextWithExamples(body, examples, namedExamples) 
            }} />
          ) : (
            body
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="text-xs text-gray-500 mb-3 italic">
            {footer}
          </div>
        )}

        {/* Message metadata */}
        <div className="flex items-center justify-end gap-1 text-xs text-gray-500 mb-3">
          <Clock className="w-3 h-3" />
          <span>11:30 AM</span>
          <CheckCheck className="w-4 h-4 text-blue-500" />
        </div>

        {/* Buttons */}
        {buttons && buttons.length > 0 && (
          <div className="border-t border-gray-200 pt-3 space-y-2">
            {buttons.map((button, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-center py-2.5 px-4 border-2 border-green-500 text-green-600 rounded-full text-sm font-medium hover:bg-green-50 transition-colors cursor-pointer"
              >
                {button.type === 'URL' && '🔗 '}
                {button.type === 'PHONE_NUMBER' && '📞 '}
                {button.type === 'COPY_CODE' && '📋 '}
                {button.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppPreview;