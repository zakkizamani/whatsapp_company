// src/components/saved_templates/SavedTemplatesStats.jsx
import React from 'react';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const SavedTemplatesStats = ({ stats }) => {
  const statsConfig = [
    {
      title: 'Total Templates',
      value: stats.total,
      icon: FileText,
      gradient: 'from-green-500 to-green-600',
      iconColor: 'text-green-200',
      textColor: 'text-green-100'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-200',
      textColor: 'text-blue-100'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-200',
      textColor: 'text-yellow-100'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
      iconColor: 'text-red-200',
      textColor: 'text-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <div key={index} className={`bg-gradient-to-r ${stat.gradient} rounded-xl p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${stat.textColor} text-sm font-medium`}>{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <IconComponent className={`w-8 h-8 ${stat.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavedTemplatesStats;