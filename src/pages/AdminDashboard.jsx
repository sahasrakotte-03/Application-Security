import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Users, 
  ShieldAlert, 
  UserCheck, 
  AlertTriangle, 
  Activity, 
  Search, 
  Unlock, 
  CheckCircle2, 
  RotateCw,
  Award,
  ScrollText
} from 'lucide-react';
import { SecurityBadge } from '../components/SecurityBadge';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, usersRes] = await Promise.all([
        api.get('/admin/security-status'),
        api.get('/admin/users'),
      ]);
      setMetrics(metricsRes.data);
      setUsers(usersRes.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load administrative telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUnlockUser = async (userId, username) => {
    try {
      await api.post(`/admin/users/${userId}/unlock`);
      setActionMessage(`Account for user '${username}' unlocked successfully.`);
      fetchAdminData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to unlock account.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-600">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3"></div>
        <p className=" text-xs uppercase tracking-widest text-purple-700">
          Authenticating Admin Clearance & Aggregating SOC Metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 rounded">
              ADMINISTRATIVE CLEARANCE VERIFIED
            </span>
            <span className="text-xs text-slate-600">RBAC Enforcement Active</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-700" />
            <span>SECURITY OPERATIONS CENTER (SOC) CONSOLE</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 ">
            SYSTEM TELEMETRY, USER ROLES & THREAT CONTROLS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/security-events"
            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-md text-xs flex items-center gap-2 transition-colors"
          >
            <ScrollText className="w-3.5 h-3.5 text-purple-700" />
            <span>Audit Trail Logs</span>
          </Link>

          <button
            onClick={fetchAdminData}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-md text-xs transition-colors"
            title="Refresh"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-xs ">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs ">
          {error}
        </div>
      )}

      {/* Metrics Row (6 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 ">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[10px] text-slate-600 flex items-center justify-between mb-1">
            <span>TOTAL USERS</span>
            <Users className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div className="text-xl font-bold text-slate-900">{metrics?.total_users}</div>
          <div className="text-[10px] text-slate-500 mt-1">Registered Accounts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[10px] text-slate-600 flex items-center justify-between mb-1">
            <span>ACTIVE USERS</span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="text-xl font-bold text-emerald-700">{metrics?.active_users}</div>
          <div className="text-[10px] text-slate-500 mt-1">Operational</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[10px] text-slate-600 flex items-center justify-between mb-1">
            <span>ADMIN ACCOUNTS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
          </div>
          <div className="text-xl font-bold text-purple-700">{metrics?.admin_users}</div>
          <div className="text-[10px] text-slate-500 mt-1">Elevated RBAC</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[10px] text-slate-600 flex items-center justify-between mb-1">
            <span>SECURITY EVENTS</span>
            <Activity className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div className="text-xl font-bold text-blue-700">{metrics?.total_security_events}</div>
          <div className="text-[10px] text-slate-500 mt-1">Audit Trail Records</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[10px] text-slate-600 flex items-center justify-between mb-1">
            <span>FAILED LOGINS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="text-xl font-bold text-amber-700">{metrics?.failed_logins_count}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {metrics?.locked_accounts_count} Locked
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-[10px] text-slate-600 flex items-center justify-between mb-1">
            <span>SECURITY SCORE</span>
            <Award className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="text-xl font-bold text-emerald-700">{metrics?.security_score}/100</div>
          <div className="text-[10px] text-slate-500 mt-1">Dynamic Calculation</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              <span>REGISTERED USER IDENTITIES & RBAC STATUS</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Backend-enforced account roles and brute-force lockout status
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Search user, email, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 "
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const dateStr = new Date(u.created_at).toLocaleDateString();
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-500">#{u.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{u.username}</span>
                        {u.full_name && (
                          <span className="text-slate-500 text-[10px] font-normal">({u.full_name})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{u.email}</td>
                      <td className="px-4 py-3">
                        <SecurityBadge status={u.role} size="xs" showIcon={false} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">{dateStr}</td>
                      <td className="px-4 py-3">
                        {u.is_locked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                            LOCKED OUT
                          </span>
                        ) : (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active ({u.failed_attempts} fails)</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {u.is_locked ? (
                          <button
                            onClick={() => handleUnlockUser(u.id, u.username)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 rounded text-[11px] transition-colors"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>Unlock Account</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
