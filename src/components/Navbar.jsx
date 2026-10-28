import React, { useEffect, useState } from 'react';
import { Shield, Activity, LogOut, User as UserIcon, FileCode, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { SecurityBadge } from './SecurityBadge';

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState('CHECKING');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        if (res.data.status === 'healthy') {
          setHealthStatus('ONLINE');
        } else {
          setHealthStatus('DEGRADED');
        }
      } catch (err) {
        setHealthStatus('OFFLINE');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-blue-700 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-slate-900 text-sm sm:text-base">SECUREAPP</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] text-slate-600 tracking-wider hidden sm:block">APPLICATION SECURITY DEMONSTRATOR</p>
            </div>
          </Link>
        </div>

        {/* Center: Defense Status Indicator */}
        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                healthStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                healthStatus === 'ONLINE' ? 'bg-emerald-600' : 'bg-red-600'
              }`}></span>
            </span>
            <span className="text-slate-600">DEFENSE STATUS:</span>
            <span className={healthStatus === 'ONLINE' ? 'text-emerald-700 font-semibold' : 'text-red-700'}>
              {healthStatus}
            </span>
          </div>

          <span className="text-slate-300">|</span>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>OpenAPI Docs</span>
          </a>
        </div>

        {/* Right: Auth Profile & Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-2 justify-end">
                  <span>{user?.full_name || user?.username}</span>
                  <SecurityBadge status={user?.role} size="xs" showIcon={false} />
                </div>
                <div className="text-[10px] text-slate-600 truncate max-w-[140px]">
                  @{user?.username}
                </div>
              </div>

              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 hover:text-blue-800 hover:border-blue-600 transition-colors"
                title="Profile"
              >
                <UserIcon className="w-4 h-4" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-red-800 bg-slate-100 hover:bg-red-50 border border-slate-300 hover:border-red-300 rounded-md transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-medium bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
