// src/components/template/VariableExamplesForm.jsx
import React from 'react';

const VariableExamplesForm = ({ 
  type, 
  examples = [], 
  namedExamples = [], 
  onExamplesChange, 
  onNamedExamplesChange 
}) => {
  if (type === 'positional') {
    return (
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          Variable Examples (Positional)
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            {"{{1}}, {{2}}, etc."}
          </span>
        </h4>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-mono bg-white px-3 py-2 rounded border">
                {`{{${index + 1}}}`}
              </span>
              <input
                type="text"
                value={example}
                onChange={(e) => {
                  const newExamples = [...examples];
                  newExamples[index] = e.target.value;
                  onExamplesChange(newExamples);
                }}
                placeholder={`Example for variable ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'named') {
    return (
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          Variable Examples (Named)
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {"{{name}}, {{username}}, etc."}
          </span>
        </h4>
        <div className="space-y-2">
          {namedExamples.map((namedExample, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-mono bg-white px-3 py-2 rounded border">
                {`{{${namedExample.param_name}}}`}
              </span>
              <input
                type="text"
                value={namedExample.example}
                onChange={(e) => {
                  const newNamedExamples = [...namedExamples];
                  newNamedExamples[index].example = e.target.value;
                  onNamedExamplesChange(newNamedExamples);
                }}
                placeholder={`Example for ${namedExample.param_name}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default VariableExamplesForm;