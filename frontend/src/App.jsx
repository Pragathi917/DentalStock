import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddInventory from './pages/AddInventory';
import EditInventory from './pages/EditInventory';
import Usage from './pages/Usage';
import Forecast from './pages/Forecast';
import Alerts from './pages/Alerts';
import Users from './pages/Users';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Root redirection helper
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#F7F9F8'
      }}>
        <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Root Path Redirection Rule */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Auth Gateway */}
          <Route path="/login" element={<Login />} />

          {/* Protected Clinical Workspaces Layout Wrapper */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Inventory Routes */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/add" element={<AdminRoute><AddInventory /></AdminRoute>} />
            <Route path="inventory/edit/:id" element={<AdminRoute><EditInventory /></AdminRoute>} />
            
            {/* Analytics & Logs */}
            <Route path="usage" element={<Usage />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="alerts" element={<Alerts />} />
            
            {/* Admin Management Workspace */}
            <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />

            {/* Access Denied Page */}
            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
