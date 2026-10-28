import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, AlertCircle, UserPlus } from 'lucide-react';
import { PasswordMeter } from '../components/PasswordMeter';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [validationDetails, setValidationDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationDetails([]);

    // Client-side usability checks
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirm_password: confirmPassword,
      });
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.message || 'Registration failed.');
      if (err.details && Array.isArray(err.details)) {
        setValidationDetails(err.details);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 cyber-grid">
      <div className="max-w-lg w-full">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm ">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 ">PROVISION SECURE ACCOUNT</h1>
            <p className="text-xs text-slate-600 mt-1 ">DEFENSIVE INPUT VALIDATION & ARGON2ID HASHING</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-md border bg-red-50 border-red-200 text-red-700 text-xs ">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>INPUT VALIDATION REJECTED:</span>
              </div>
              <p>{error}</p>
              {validationDetails.length > 0 && (
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700">
                  {validationDetails.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-700 mb-1.5">
                Username <span className="text-blue-700">*</span> (3-30 alphanumeric, hyphens, underscores)
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
                  placeholder="e.g. jdoe_security"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 "
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-700 mb-1.5">
                Corporate or Personal Email <span className="text-blue-700">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jdoe@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 "
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-700 mb-1.5">
                Cryptographic Password <span className="text-blue-700">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 10 chars, uppercase, number & symbol"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 "
                />
              </div>
              <PasswordMeter password={password} />
            </div>

            <div>
              <label className="block text-xs text-slate-700 mb-1.5">
                Confirm Password <span className="text-blue-700">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password exactly"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 "
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-md shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Evaluating Password & Registering...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Protected Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link to Login */}
          <div className="mt-5 text-center text-xs text-slate-600">
            Already have an identity provisioned?{' '}
            <Link to="/login" className="text-blue-700 hover:text-blue-800 underline underline-offset-2">
              Sign in to Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
