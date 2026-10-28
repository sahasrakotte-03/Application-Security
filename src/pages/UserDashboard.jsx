import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  Lightbulb, 
  ShieldAlert, 
  Clock, 
  Lock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { SecurityBadge } from '../components/SecurityBadge';

export const UserDashboard = () => {
  const { user, isAdmin } = useAuth();

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 relative overflow-hidden">
        

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SecurityBadge status={user?.role} size="sm" />
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE SESSION
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, <span className="text-blue-700">{user?.full_name || user?.username}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 ">
              Identity verified via cryptographically signed JWT. Role-Based Access Control enforced on backend.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/security-status"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-slate-300 text-blue-700 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Verify Security Checks</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Account Security Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-2">
            <span>IDENTITY</span>
            <UserCheck className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-lg font-bold text-slate-900 truncate">@{user?.username}</div>
          <div className="text-[11px] text-slate-600 mt-1">Email: {user?.email}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-2">
            <span>ASSIGNED ROLE</span>
            <Shield className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{user?.role}</span>
            <span className="text-xs text-slate-500 font-normal">
              {isAdmin ? '(Superuser Clearance)' : '(Standard Clearance)'}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">Backend Enforced: HTTP 403 Barrier</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-2">
            <span>PASSWORD CRYPTO</span>
            <Lock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-lg font-bold text-emerald-700">Argon2id</div>
          <div className="text-[11px] text-slate-600 mt-1">Memory-Hard Salted Hash</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-2">
            <span>ACCOUNT CREATED</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-lg font-bold text-slate-900">{formattedDate}</div>
          <div className="text-[11px] text-slate-600 mt-1">
            Failed Logins: <span className="text-slate-700 ">{user?.failed_attempts || 0} / 5</span>
          </div>
        </div>
      </div>

      {/* Defensive Application Security Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Security Controls in Action */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <span>ACTIVE APPLICATION SECURITY CONTROLS</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start justify-between gap-3">
              <div>
                <div className="text-slate-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Input Validation & Sanitization (Pydantic V2)</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-sans pl-6">
                  Strict schema verification rejects malformed usernames, unverified emails, and password boundary violations before execution.
                </p>
              </div>
              <SecurityBadge status="PASS" size="xs" />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start justify-between gap-3">
              <div>
                <div className="text-slate-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Argon2id Salted Credential Hashing</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-sans pl-6">
                  Protects stored passwords against GPU cracking and ASIC rainbow tables using 32MiB memory cost and constant-work timing defense.
                </p>
              </div>
              <SecurityBadge status="PASS" size="xs" />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start justify-between gap-3">
              <div>
                <div className="text-slate-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Brute-Force Protection & Account Lockout</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-sans pl-6">
                  Accounts automatically trigger a 15-minute temporary lockout after 5 consecutive failed login attempts, blocking automated attacks.
                </p>
              </div>
              <SecurityBadge status="PASS" size="xs" />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start justify-between gap-3">
              <div>
                <div className="text-slate-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Zero-Trust Backend RBAC Enforcement</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-sans pl-6">
                  Administrative APIs independently authenticate Bearer JWT claims and immediately issue HTTP 403 Forbidden on role mismatches.
                </p>
              </div>
              <SecurityBadge status="PASS" size="xs" />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Role Navigation */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-700" />
              <span>QUICK ACTIONS</span>
            </h2>

            <div className="space-y-2.5">
              <Link
                to="/profile"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <div>
                    <div className="text-xs font-medium text-slate-800 group-hover:text-blue-700">My Profile</div>
                    <div className="text-[10px] text-slate-600">View permitted metadata</div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 ">→</span>
              </Link>

              <Link
                to="/change-password"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="text-xs font-medium text-slate-800 group-hover:text-emerald-700">Change Password</div>
                    <div className="text-[10px] text-slate-600">Update credentials securely</div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 ">→</span>
              </Link>

              <Link
                to="/security-recommendations"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-700" />
                  <div>
                    <div className="text-xs font-medium text-slate-800 group-hover:text-amber-700">Recommendations</div>
                    <div className="text-[10px] text-slate-600">Academic vs Enterprise</div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 ">→</span>
              </Link>

              <Link
                to="/admin/dashboard"
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${
                  isAdmin
                    ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800'
                    : 'bg-slate-50 hover:bg-red-50 border-slate-200 hover:border-red-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className={`w-4 h-4 ${isAdmin ? 'text-purple-700' : 'text-red-700'}`} />
                  <div>
                    <div className="text-xs font-medium text-slate-800 group-hover:text-purple-800 flex items-center gap-1.5">
                      <span>Admin SOC Area</span>
                      {!isAdmin && (
                        <span className="text-[9px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                          403 Barrier
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      {isAdmin ? 'Access SOC audit logs' : 'Demonstrate RBAC denial'}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 ">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 ">
            College Cybersecurity Project 4: Defensive Demonstrator
          </div>
        </div>
      </div>
    </div>
  );
};
