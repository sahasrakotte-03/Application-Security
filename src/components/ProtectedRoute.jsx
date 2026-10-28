import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-slate-700">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mb-4"></div>
        <p className=" text-sm tracking-widest text-blue-700 uppercase">Validating Security Tokens...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-8 text-center shadow-sm ">
          <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8 text-red-700" />
          </div>
          <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 border border-red-200 rounded-full">
            HTTP 403 FORBIDDEN
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-4 mb-2">Access Denied: Admin Clearance Required</h2>
          <p className="text-sm text-slate-600 mb-6">
            Your current account <span className="text-blue-700 ">@{user?.username}</span> has role <span className="text-amber-700 ">[{user?.role}]</span>. Administrative privileges are enforced on the backend.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-left mb-6 text-xs text-slate-600">
            <div className="text-red-700 font-bold mb-1">DEFENSIVE RBAC POLICY:</div>
            <div>Strict Role-Based Access Control verified and blocked unauthorized route traversal.</div>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-md transition-colors border border-slate-300"
          >
            <ArrowLeft className="w-4 h-4" /> Return to User Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
};
