import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';


import { Toaster } from '@/components/ui/sonner';
import Login from './pages/Login';
import MasterDashboard from './pages/MasterDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import Layout from './components/layout/Layout';
import LandingPage from './components/landing/LandingPage';
import Register from './pages/Register';
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const { checkAuth, user } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/"
          element={
            user ? (
              user.role === 'master' ? (
                <Navigate to="/master" replace />
              ) : (
                <Navigate to="/company" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/master/*"
          element={
            <ProtectedRoute requiredRole="master">
              <Layout>
                <MasterDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/*"
          element={
            <ProtectedRoute requiredRole="company">
              <Layout>
                <CompanyDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;