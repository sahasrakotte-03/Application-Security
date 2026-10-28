import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, CheckCircle2, Key, Info } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Check if redirected from expired token or registration
  const queryParams = new URLSearchParams(location.search);
  const registered = queryParams.get('registered');
  const expired = queryParams.get('expired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLocked(false);

    if (!username.trim() || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(username.trim(), password);
      // If admin, redirect to admin dashboard; else user dashboard
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.status === 429) {
        setIsLocked(true);
        setError(err.message || 'Account is temporarily locked due to multiple failed login attempts.');
      } else {
        // Safe generic error message prevents account enumeration
        setError(err.message || 'Invalid username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userVal, passVal) => {
    setUsername(userVal);
    setPassword(passVal);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 cyber-grid">
      <div className="max-w-md w-full">
        {/* Security Alert Messages */}
        {registered && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-700 text-xs ">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Registration successful! Your credentials are protected with Argon2id. Please log in.</span>
          </div>
        )}

        {expired && (
          <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-700 text-xs ">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Session expired. JWT token verification failed. Please authenticate again.</span>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm ">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Shield className="w-6 h-6 text-blue-700" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 ">SECURE ACCESS PORTAL</h1>
            <p className="text-xs text-slate-600 mt-1 ">AUTHENTICATE WITH DEFENSIVE CONTROLS</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              className={`mb-5 p-3 rounded-md border flex items-start gap-2.5 text-xs ${
                isLocked
                  ? 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{isLocked ? 'BRUTE-FORCE LOCKOUT TRIGGERED:' : 'AUTHENTICATION FAILED:'}</span>
                <p className="mt-0.5">{error}</p>
                {isLocked && (
                  <p className="mt-1 text-[11px] text-red-700">
                    Defensive lockout protects this account from dictionary & credential-stuffing attacks.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-700 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or user1"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-md shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Argon2id Hash...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box for Faculty Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2.5">
              <Info className="w-3.5 h-3.5 text-blue-700" />
              <span>FACULTY EVALUATION QUICK LOGINS:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin', 'AdminSecured#2026!')}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-purple-200 hover:border-purple-300 rounded-md text-left transition-colors"
              >
                <div className="text-[11px] font-semibold text-purple-700 flex items-center gap-1">
                  <span>ADMIN ROLE</span>
                </div>
                <div className="text-[10px] text-slate-600 truncate">admin</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('user1', 'UserSecured#2026!')}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-blue-200 hover:border-blue-400 rounded-md text-left transition-colors"
              >
                <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                  <span>USER ROLE</span>
                </div>
                <div className="text-[10px] text-slate-600 truncate">user1</div>
              </button>
            </div>
          </div>

          {/* Footer link to Register */}
          <div className="mt-5 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-700 hover:text-blue-800 underline underline-offset-2">
              Register New Identity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
