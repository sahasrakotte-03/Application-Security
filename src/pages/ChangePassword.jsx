import React, { useState } from 'react';
import api from '../services/api';
import { KeyRound, Lock, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { PasswordMeter } from '../components/PasswordMeter';

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setValidationErrors([]);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });

      setSuccess(response.data.detail || 'Password successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.message || 'Password update failed.');
      if (err.details && Array.isArray(err.details)) {
        setValidationErrors(err.details);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-emerald-700" />
          <span>SECURE CREDENTIAL ROTATION</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 ">
          ARGON2ID RE-HASHING WITH ZERO PLAINTEXT PERSISTENCE
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-700 text-xs shadow-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs ">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>CREDENTIAL ROTATION FAILED:</span>
          </div>
          <p>{error}</p>
          {validationErrors.length > 0 && (
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700">
              {validationErrors.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-700 mb-1.5">
              Current Password <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Verify current credentials"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 "
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1.5">
              New Password <span className="text-emerald-700">*</span> (Min 10 characters, upper, lower, digit, symbol)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong replacement passphrase"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 "
              />
            </div>
            <PasswordMeter password={newPassword} />
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1.5">
              Confirm New Password <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm replacement passphrase"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 "
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-blue-700 font-semibold">SECURITY GUARANTEE:</span> Passwords are never written to disk in plaintext, logged in console outputs, or transmitted in unhashed formats.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-md shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Cryptographically Re-Hashing...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
