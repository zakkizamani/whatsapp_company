import { X } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type, onClose, duration = 5000 }) => {
  const bgColor = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`fixed top-6 right-6 border rounded-xl p-4 shadow-lg z-50 max-w-md transition-all duration-300 ${bgColor[type]} flex items-start gap-3`}>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;