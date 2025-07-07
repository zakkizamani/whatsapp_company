// src/services/errorLoggingService.js

import { CONFIG } from '../utils/constants';

class ErrorLoggingService {
  constructor() {
    this.endpoint = `${CONFIG.API_BASE_URL}/logging/error`;
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  async logError(error, errorInfo = {}, additionalContext = {}) {
    try {
      const errorData = {
        // Error details
        message: error.message,
        stack: error.stack,
        name: error.name,
        
        // React error info
        componentStack: errorInfo.componentStack,
        
        // User context
        userId: localStorage.getItem(CONFIG.STORAGE_KEYS.LOGGED_IN_USER) || 'anonymous',
        sessionId: this.getSessionId(),
        
        // Environment context
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        
        // Additional context
        ...additionalContext,
        
        // App context
        version: process.env.REACT_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV,
        buildTime: process.env.REACT_APP_BUILD_TIME
      };

      // Only send to server in production or if explicitly enabled
      if (this.isProduction || process.env.REACT_APP_LOG_ERRORS === 'true') {
        await this.sendToServer(errorData);
      }

      // Always log to console in development
      if (!this.isProduction) {
        console.group('🚨 Error Boundary Log');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Full Context:', errorData);
        console.groupEnd();
      }

    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  async sendToServer(errorData) {
    try {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(errorData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (networkError) {
      // Fallback: store locally if server is unavailable
      this.storeLocally(errorData);
      throw networkError;
    }
  }

  storeLocally(errorData) {
    try {
      const key = 'pending_error_logs';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(errorData);
      
      // Keep only last 10 errors to avoid localStorage bloat
      const recent = existing.slice(-10);
      localStorage.setItem(key, JSON.stringify(recent));
      
    } catch (storageError) {
      console.error('Failed to store error locally:', storageError);
    }
  }

  async flushLocalErrors() {
    try {
      const key = 'pending_error_logs';
      const pendingErrors = JSON.parse(localStorage.getItem(key) || '[]');
      
      if (pendingErrors.length === 0) return;

      // Try to send all pending errors
      const promises = pendingErrors.map(errorData => 
        this.sendToServer(errorData).catch(err => {
          console.warn('Failed to send pending error:', err);
          return err;
        })
      );

      await Promise.allSettled(promises);
      
      // Clear local storage after attempting to send
      localStorage.removeItem(key);
      
    } catch (error) {
      console.error('Failed to flush local errors:', error);
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('error_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('error_session_id', sessionId);
    }
    return sessionId;
  }

  // Helper method for manual error reporting
  reportError(error, context = {}) {
    this.logError(error, {}, context);
  }

  // Helper method for performance/warning issues
  reportWarning(message, context = {}) {
    const warning = new Error(message);
    warning.name = 'Warning';
    this.logError(warning, {}, { level: 'warning', ...context });
  }
}

// Create singleton instance
export const errorLogger = new ErrorLoggingService();

// Initialize error flushing on app start
if (typeof window !== 'undefined') {
  // Flush pending errors when app starts
  setTimeout(() => {
    errorLogger.flushLocalErrors();
  }, 5000);

  // Flush pending errors before page unload
  window.addEventListener('beforeunload', () => {
    errorLogger.flushLocalErrors();
  });
}