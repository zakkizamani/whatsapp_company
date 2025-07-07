import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './pages/LoginForm.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TemplateLibrary from './pages/TemplateLibrary.jsx'
import CreateTemplate from './pages/CreateTemplate.jsx';
import SavedTemplates from './pages/SavedTemplates';
import useAuth from './hooks/useAuth.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './App.css'

// Protected Route Component with Error Boundary
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  return isAuthenticated ? (
    <ErrorBoundary level="page">
      {children}
    </ErrorBoundary>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <ErrorBoundary level="app">
      <Router>
        <div className="App">
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Login Route - Wrapped in Error Boundary */}
            <Route 
              path="/login" 
              element={
                <ErrorBoundary level="page">
                  <LoginForm />
                </ErrorBoundary>
              } 
            />
            
            {/* Protected Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Template Library Route */}
            <Route 
              path="/templates/library" 
              element={
                <ProtectedRoute>
                  <TemplateLibrary />
                </ProtectedRoute>
              } 
            />

            {/* Protected Show Templates Route */}
            <Route 
              path="/templates" 
              element={
                <ProtectedRoute>
                  <SavedTemplates />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Create Template Route */}
            <Route 
              path="/templates/create" 
              element={
                <ProtectedRoute>
                  <CreateTemplate />
                </ProtectedRoute>
              } 
            />
            
            {/* Template Edit Route */}
            <Route 
              path="/edit-template/:templateId" 
              element={
                <ProtectedRoute>
                  <CreateTemplate isEdit={true} />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all other routes and redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App