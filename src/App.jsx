import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FacultyDemoGuide } from './components/FacultyDemoGuide';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserDashboard } from './pages/UserDashboard';
import { Profile } from './pages/Profile';
import { ChangePassword } from './pages/ChangePassword';
import { SecurityOverview } from './pages/SecurityOverview';
import { SecurityRecommendations } from './pages/SecurityRecommendations';
import { AdminDashboard } from './pages/AdminDashboard';
import { SecurityEvents } from './pages/SecurityEvents';
import { NotFound } from './pages/NotFound';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex">
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 lg:pl-64 p-4 lg:p-6 max-w-7xl mx-auto w-full transition-all">
          <Outlet />
        </main>
      </div>

      {/* Floating 12-Step Faculty Presentation Guide */}
      <FacultyDemoGuide />
    </div>
  );
};

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Index Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Authenticated Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/security-status" element={<SecurityOverview />} />
            <Route path="/security-recommendations" element={<SecurityRecommendations />} />

            {/* Admin-Only RBAC Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/security-events"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <SecurityEvents />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
