import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  KeyRound, 
  ShieldCheck, 
  Lightbulb, 
  ShieldAlert, 
  ScrollText, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { isAdmin, user } = useAuth();

  const userNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Security Overview', path: '/security-status', icon: ShieldCheck },
    { name: 'Recommendations', path: '/security-recommendations', icon: Lightbulb },
    { name: 'My Profile', path: '/profile', icon: UserCheck },
    { name: 'Change Password', path: '/change-password', icon: KeyRound },
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: ShieldAlert, badge: 'ADMIN' },
    { name: 'Security Audit Logs', path: '/admin/security-events', icon: ScrollText, badge: 'ADMIN' },
  ];

  const linkClass = ({ isActive }) =>
 `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-medium transition-all ${
      isActive
        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* User Section */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 px-3.5 mb-2 flex items-center gap-2">
              <span>Security Portal</span>
            </div>
            <nav className="space-y-1">
              {userNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className={linkClass}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Admin Controls Section */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-purple-700 px-3.5 mb-2 flex items-center justify-between">
              <span>Admin Operations</span>
              <span className="text-[9px] bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-bold">
                RBAC
              </span>
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className={linkClass}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{item.name}</span>
                    {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                  </NavLink>
                );
              })}
            </nav>

            {!isAdmin && (
              <div className="mt-3 mx-2 p-2.5 bg-slate-900/80 border border-slate-200 rounded-md text-[11px] text-slate-500 leading-relaxed ">
                <span className="text-amber-700 font-semibold">User Role:</span> Admin routes require ADMIN token. Direct access attempts return 403.
              </div>
            )}
          </div>
        </div>

        {/* Footer info card */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span>CRYPTO:</span>
            <span className="text-blue-700 font-semibold">Argon2id</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>TOKEN:</span>
            <span className="text-emerald-700 font-semibold">JWT HS256</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>RBAC:</span>
            <span className="text-purple-700 font-semibold">Backend Enforced</span>
          </div>
        </div>
      </aside>
    </>
  );
};
