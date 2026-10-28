import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Shield, Mail, Calendar, Lock, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { SecurityBadge } from '../components/SecurityBadge';

export const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setSaving(true);

    try {
      await updateProfile({ full_name: fullName.trim() });
      setSuccess('Profile metadata updated successfully. Event recorded in security log.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleString()
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-700" />
          <span>SECURITY PROFILE & PERMITTED ATTRIBUTES</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 ">
          DEFENSIVE LEAST-PRIVILEGE SELF-SERVICE MODIFICATION
        </p>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-700 text-xs ">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-xs ">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Identity Overview Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="w-16 h-16 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-700 text-xl font-bold shadow-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div className="text-center">
            <h3 className="font-bold text-slate-900 text-base">{user?.full_name || user?.username}</h3>
            <p className="text-xs text-slate-600 mt-0.5">@{user?.username}</p>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-3 text-xs ">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">ASSIGNED ROLE:</span>
              <SecurityBadge status={user?.role} size="xs" />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">STATUS:</span>
              <span className="text-emerald-700 font-semibold">Active Identity</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">FAILED LOGINS:</span>
              <span className="text-slate-800">{user?.failed_attempts || 0} / 5</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Editable & Non-Editable Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Permitted Editable Field */}
            <div>
              <label className="block text-xs text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Display Full Name (Permitted Field)</span>
                <span className="text-[10px] text-blue-700">Editable</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alice Security Engineer"
                maxLength={100}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Read-Only System Identity Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Username (System ID)</span>
                  <Lock className="w-3 h-3 text-slate-500" />
                </label>
                <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600">
                  {user?.username}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Registered Email</span>
                  <Lock className="w-3 h-3 text-slate-500" />
                </label>
                <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 truncate">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Security Role (RBAC)</span>
                  <Lock className="w-3 h-3 text-slate-500" />
                </label>
                <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600">
                  {user?.role}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Identity Provisioned Date</span>
                  <Calendar className="w-3 h-3 text-slate-500" />
                </label>
                <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 truncate">
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Defensive RBAC Explanatory Notice */}
            <div className="p-3.5 bg-slate-900/90 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1 mt-4">
              <div className="text-amber-700 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>DEFENSIVE PRIVILEGE ESCALATION PREVENTION:</span>
              </div>
              <p className="leading-relaxed">
                Role, Email, and Identity attributes cannot be modified through user-facing APIs.
                Any client-side attempts to submit elevated role values are strictly ignored and rejected on the backend.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-md shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Permitted Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
