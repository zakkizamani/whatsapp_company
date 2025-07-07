// src/components/template/BodyForm.jsx
import React from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { detectParameterType } from '../../utils/templateHelpers';
import { TEMPLATE_LIMITS } from '../../utils/templateConstants';
import VariableExamplesForm from './VariableExamplesForm';

const BodyForm = ({ 
  templateData, 
  onInputChange 
}) => {
  const paramType = detectParameterType(templateData.body.text);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-green-600" />
        Message Body <span className="text-red-500">*</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Text
          </label>
          <textarea
            value={templateData.body.text}
            onChange={(e) => onInputChange('body', 'text', e.target.value)}
            placeholder="Enter your message. Use {{1}}, {{2}} for positional or {{name}}, {{username}} for named variables."
            rows={4}
            maxLength={TEMPLATE_LIMITS.BODY_TEXT_MAX_LENGTH}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            {templateData.body.text.length}/{TEMPLATE_LIMITS.BODY_TEXT_MAX_LENGTH} characters
          </p>
        </div>

        {/* Variable Examples */}
        {paramType === 'positional' && (
          <VariableExamplesForm
            type="positional"
            examples={templateData.body.examples}
            onExamplesChange={(examples) => onInputChange('body', 'examples', examples)}
          />
        )}

        {paramType === 'named' && (
          <VariableExamplesForm
            type="named"
            namedExamples={templateData.body.namedExamples}
            onNamedExamplesChange={(namedExamples) => onInputChange('body', 'namedExamples', namedExamples)}
          />
        )}

        {paramType === 'mixed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Invalid Parameter Format</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Cannot mix positional ({"{{1}}"}) and named ({"{{name}}"}) parameters. Use either all positional or all named.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyForm;