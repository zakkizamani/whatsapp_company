import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to your error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Example: Log to external service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // In production, you might want to send this to services like:
    // - Sentry
    // - LogRocket  
    // - Bugsnag
    // - Your custom logging service
    
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem('loggedInUser') || 'anonymous'
      };

      // Example: Send to your logging endpoint
      // fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // }).catch(console.error);

      console.log('Error logged:', errorData);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-1">Oops! Something went wrong</h1>
                    <p className="text-red-100">
                      {this.props.level === 'page' ? 'This page' : 'This component'} encountered an unexpected error
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">What happened?</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We're sorry for the inconvenience. The application encountered an unexpected error and couldn't complete your request. 
                    Our team has been automatically notified and is working to fix this issue.
                  </p>
                </div>

                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Bug className="w-5 h-5 text-red-500" />
                      Error Details (Development)
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <details className="mb-3">
                        <summary className="cursor-pointer font-medium text-red-600 hover:text-red-700">
                          {this.state.error.message}
                        </summary>
                        <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40 bg-white p-3 rounded border">
                          {this.state.error.stack}
                        </pre>
                      </details>
                      
                      {this.state.errorInfo && (
                        <details>
                          <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-700">
                            Component Stack
                          </summary>
                          <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40 bg-white p-3 rounded border">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <Home className="w-5 h-5" />
                    Go to Dashboard
                  </button>
                </div>

                {/* Contact Support */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-blue-800">
                    If this problem persists, please contact our support team and include the error ID: 
                    <code className="mx-1 px-2 py-1 bg-blue-100 rounded text-xs">
                      {Date.now().toString(36)}
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;