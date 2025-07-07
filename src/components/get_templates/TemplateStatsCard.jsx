// src/components/template/TemplateStatsCards.jsx
import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Pause, 
  Ban, 
  RotateCcw, 
  RefreshCw,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const TemplateStatsCards = ({ stats, loading = false }) => {
  // Calculate percentages
  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Get trend indicator (mock data - in real app, you'd compare with previous period)
  const getTrendIndicator = (status) => {
    // Mock trend data
    const trends = {
      total: 5,
      approved: 12,
      pending: -8,
      rejected: -15,
      flagged: 0
    };
    
    const trend = trends[status] || 0;
    
    if (trend > 0) {
      return { icon: TrendingUp, color: 'text-green-500', value: `+${trend}%` };
    } else if (trend < 0) {
      return { icon: TrendingDown, color: 'text-red-500', value: `${trend}%` };
    } else {
      return { icon: Minus, color: 'text-gray-500', value: '0%' };
    }
  };

  const statsConfig = [
    {
      key: 'total',
      label: 'Total Templates',
      value: stats.total,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'text-blue-200'
    },
    {
      key: 'approved',
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'text-green-200',
      percentage: getPercentage(stats.approved, stats.total)
    },
    {
      key: 'pending',
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-yellow-500 to-yellow-600',
      iconBg: 'text-yellow-200',
      percentage: getPercentage(stats.pending, stats.total)
    },
    {
      key: 'rejected',
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
      iconBg: 'text-red-200',
      percentage: getPercentage(stats.rejected, stats.total)
    }
  ];

  const secondaryStats = [
    {
      key: 'flagged',
      label: 'Flagged',
      value: stats.flagged,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      key: 'paused',
      label: 'Paused',
      value: stats.paused,
      icon: Pause,
      color: 'text-gray-600',
      bg: 'bg-gray-50'
    },
    {
      key: 'disabled',
      label: 'Disabled',
      value: stats.disabled,
      icon: Ban,
      color: 'text-gray-600',
      bg: 'bg-gray-50'
    },
    {
      key: 'inAppeal',
      label: 'In Appeal',
      value: stats.inAppeal,
      icon: RotateCcw,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      key: 'reinstated',
      label: 'Reinstated',
      value: stats.reinstated,
      icon: RefreshCw,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      key: 'pendingDeletion',
      label: 'Pending Deletion',
      value: stats.pendingDeletion,
      icon: Trash2,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Main Stats Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="w-16 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="w-12 h-8 bg-gray-300 rounded mb-2"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Stats Loading */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="animate-pulse">
            <div className="w-32 h-6 bg-gray-300 rounded mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="w-8 h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="w-12 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const IconComponent = stat.icon;
          const trend = getTrendIndicator(stat.key);
          const TrendIcon = trend.icon;
          
          return (
            <div key={stat.key} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`bg-gradient-to-r ${stat.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className={`w-8 h-8 ${stat.iconBg}`} />
                  <div className="flex items-center gap-1 text-sm">
                    <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                    <span className={trend.color}>{trend.value}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
              
              {stat.percentage !== undefined && (
                <div className="px-6 py-3 bg-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Percentage</span>
                    <span className="font-semibold text-gray-900">{stat.percentage}%</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${stat.gradient} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Secondary Statistics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {secondaryStats.map((stat) => {
            const IconComponent = stat.icon;
            
            return (
              <div key={stat.key} className={`flex items-center gap-3 p-3 ${stat.bg} rounded-lg border border-gray-200`}>
                <div className="flex-shrink-0">
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600 truncate">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Template Health</h3>
            <p className="text-gray-600">
              {stats.total > 0 && (
                <>
                  <span className="font-medium text-green-600">
                    {getPercentage(stats.approved, stats.total)}% approved
                  </span>
                  {stats.rejected > 0 && (
                    <span className="font-medium text-red-600 ml-2">
                      • {getPercentage(stats.rejected, stats.total)}% rejected
                    </span>
                  )}
                  {stats.pending > 0 && (
                    <span className="font-medium text-yellow-600 ml-2">
                      • {getPercentage(stats.pending, stats.total)}% pending
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {stats.approved > stats.rejected ? (
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Healthy</span>
              </div>
            ) : stats.rejected > stats.approved ? (
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">Needs Attention</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-600">
                <Minus className="w-4 h-4" />
                <span className="text-sm font-medium">Balanced</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateStatsCards;