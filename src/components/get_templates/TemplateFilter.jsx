// src/components/template/TemplateFilters.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw,
  X,
  Calendar,
  SortAsc,
  SortDesc,
  Download,
  Settings,
  ChevronDown
} from 'lucide-react';

const TemplateFilters = ({ 
  filters, 
  onFiltersChange, 
  onRefresh, 
  onExport,
  loading = false,
  totalItems = 0 
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        onFiltersChange({ ...filters, search: searchQuery });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, onFiltersChange]);

  // Category options
  const categoryOptions = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'UTILITY', label: 'Utility' },
    { value: 'AUTHENTICATION', label: 'Authentication' }
  ];

  // Status options
  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'FLAGGED', label: 'Flagged' },
    { value: 'PAUSED', label: 'Paused' },
    { value: 'DISABLED', label: 'Disabled' },
    { value: 'IN_APPEAL', label: 'In Appeal' },
    { value: 'REINSTATED', label: 'Reinstated' },
    { value: 'PENDING_DELETION', label: 'Pending Deletion' }
  ];

  // Language options
  const languageOptions = [
    { value: 'ALL', label: 'All Languages' },
    { value: 'en', label: 'English' },
    { value: 'id', label: 'Indonesian' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'pt_BR', label: 'Portuguese (Brazil)' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'desc', label: 'Newest First', icon: SortDesc },
    { value: 'asc', label: 'Oldest First', icon: SortAsc }
  ];

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  // Apply advanced filters
  const applyAdvancedFilters = () => {
    onFiltersChange(tempFilters);
    setShowAdvancedFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      category: 'ALL',
      status: 'ALL',
      language: 'ALL',
      sortOrder: 'desc',
      dateFrom: '',
      dateTo: ''
    };
    setSearchQuery('');
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setShowAdvancedFilters(false);
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'ALL') count++;
    if (filters.status !== 'ALL') count++;
    if (filters.language && filters.language !== 'ALL') count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Main Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Sort Order */}
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Advanced Filters Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 border rounded-lg transition-all flex items-center gap-2 ${
              showAdvancedFilters || activeFiltersCount > 0
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}

          {/* Results Count */}
          <span className="text-sm text-gray-600">
            {totalItems} template{totalItems !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Button */}
          <button
            onClick={onExport}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Advanced Filters
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={tempFilters.language || 'ALL'}
                onChange={(e) => setTempFilters(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created From
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={tempFilters.dateFrom || ''}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created To
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={tempFilters.dateTo || ''}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Apply/Cancel Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={applyAdvancedFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setTempFilters(filters);
                setShowAdvancedFilters(false);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setTempFilters({
                  search: '',
                  category: 'ALL',
                  status: 'ALL',
                  language: 'ALL',
                  sortOrder: 'desc',
                  dateFrom: '',
                  dateTo: ''
                });
              }}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && !showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.category !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Category: {categoryOptions.find(c => c.value === filters.category)?.label}
                <button
                  onClick={() => handleFilterChange('category', 'ALL')}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.status !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                Status: {statusOptions.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', 'ALL')}
                  className="ml-1 hover:bg-yellow-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateFilters;