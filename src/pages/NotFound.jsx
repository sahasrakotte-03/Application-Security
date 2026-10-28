import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        <div className="w-16 h-16 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4 text-red-700">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 border border-red-200 rounded-full">
          HTTP 404 NOT FOUND
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-4 mb-2">Endpoint Does Not Exist</h1>
        <p className="text-xs text-slate-600 mb-6 ">
          The requested URL path was not found within the defensive boundary of SecureApp.
        </p>

        <div className="flex gap-3">
          <Link
            to="/dashboard"
            className="flex-1 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" /> Return Dashboard
          </Link>
          <Link
            to="/login"
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs rounded-md transition-colors border border-slate-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
