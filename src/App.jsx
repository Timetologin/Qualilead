import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './css/theme.css';

// Public components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PackagesPage from './pages/PackagesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

// Dashboard pages
import AdminDashboard from './pages/admin/Dashboard';
import LeadForm from './pages/admin/LeadForm';
import SettingsPage from './pages/admin/SettingsPage';
import ClientDashboard from './pages/client/Dashboard';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Public layout wrapper (with navbar/footer)
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <StickyCTA />
    </>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/client/dashboard" replace />;
  }

  return children;
};

// Dashboard route - redirects based on role
const DashboardRedirect = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/client/dashboard" replace />;
};

// Main App Routes
const AppRoutes = () => {
  const location = useLocation();
  
  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/client') ||
                          location.pathname === '/dashboard';
  
  const isLoginRoute = location.pathname === '/login';

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
        <Route path="/packages" element={<PublicLayout><PackagesPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        
        {/* Login page - no layout */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard redirect */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes - no public layout */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/leads/new" 
          element={
            <ProtectedRoute adminOnly>
              <LeadForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/leads/:id/edit" 
          element={
            <ProtectedRoute adminOnly>
              <LeadForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute adminOnly>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Client routes - no public layout */}
        <Route 
          path="/client/dashboard" 
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
