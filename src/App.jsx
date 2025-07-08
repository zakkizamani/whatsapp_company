// src/App.jsx - Enhanced dengan Library Integration Routes
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
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary level="app">
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Template Library Routes */}
            <Route path="/templates/library" element={
              <ProtectedRoute>
                <TemplateLibrary />
              </ProtectedRoute>
            } />
            
            {/* Template Creation Routes */}
            <Route path="/templates/create" element={
              <ProtectedRoute>
                <CreateTemplate />
              </ProtectedRoute>
            } />
            
            {/* Template Edit Routes */}
            <Route path="/templates/edit-template/:templateId" element={
              <ProtectedRoute>
                <CreateTemplate isEdit={true} />
              </ProtectedRoute>
            } />
            
            {/* Saved Templates Routes */}
            <Route path="/saved-templates" element={
              <ProtectedRoute>
                <SavedTemplates />
              </ProtectedRoute>
            } />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/templates" element={
              <ProtectedRoute>
                <Navigate to="/saved-templates" replace />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App