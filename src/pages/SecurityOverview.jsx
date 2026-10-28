import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  ShieldCheck, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Award,
  Layers,
  Cpu
} from 'lucide-react';
import { SecurityBadge } from '../components/SecurityBadge';

export const SecurityOverview = () => {
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchSecurityStatus = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/security/status');
      setSecurityData(res.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load security status.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-600">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mb-3"></div>
        <p className=" text-xs uppercase tracking-widest text-blue-700">
          Running Defensive Diagnostic Suite...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
            <span>APPLICATION SECURITY OVERVIEW & AUDIT</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 ">
            LIVE SYSTEM-WIDE DEFENSIVE POSTURE ASSESSMENT
          </p>
        </div>

        <button
          onClick={fetchSecurityStatus}
          disabled={refreshing}
          className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs rounded-md transition-colors flex items-center gap-2"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-700' : ''}`} />
          <span>Re-Run Diagnostics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs ">
          {error}
        </div>
      )}

      {/* Security Posture Summary Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Score Gauge / Ring */}
          <div className="flex items-center gap-5 md:border-r border-slate-200 md:pr-6">
            <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-700 transition-all duration-1000 ease-out"
                  strokeDasharray={`${securityData?.health_percentage || 95}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-900">
                  {securityData?.overall_score}
                </span>
                <span className="text-[10px] text-slate-600">/100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">SECURITY SCORE</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded">
                  GRADE {securityData?.grade}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">High Defensive Assurance</h2>
              <p className="text-xs text-slate-600 mt-0.5 ">
                {securityData?.checks_passed} of {securityData?.checks_total} automated controls verified PASS.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 md:border-r border-slate-200 md:pr-6 ">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-600">PASSED CHECKS</span>
              <div className="text-lg font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{securityData?.checks_passed} / {securityData?.checks_total}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-600">COMPLIANCE RATIO</span>
              <div className="text-lg font-bold text-blue-700 flex items-center gap-1.5 mt-1">
                <Award className="w-4 h-4" />
                <span>{securityData?.health_percentage}%</span>
              </div>
            </div>
          </div>

          {/* System Defense Summary */}
          <div className="text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Cpu className="w-4 h-4 text-blue-700" />
              <span>DEFENSIVE ARCHITECTURE:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every control is evaluated in real-time against live application parameters, database configurations, and cryptographic settings.
            </p>
          </div>
        </div>
      </div>

      {/* 10 Security Checks Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Layers className="w-4 h-4 text-blue-700" />
            <span>DIAGNOSTIC SECURITY VERIFICATION (10 DEFENSIVE CONTROLS)</span>
          </div>
          <span className="text-xs text-slate-500">Live API Telemetry</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {securityData?.checks.map((check) => (
            <div
              key={check.id}
              className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                    {check.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm ">{check.name}</h3>
                  <span className="text-[11px] text-slate-500 ">[{check.category}]</span>
                </div>
                <p className="text-xs text-slate-700">{check.description}</p>
                <div className="text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 inline-block">
                  <span className="text-blue-700 font-semibold">Mitigation: </span>
                  {check.mitigation_details}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                <SecurityBadge status={check.status} size="sm" />
                <span className="text-xs text-slate-600">
                  {check.score_points}/{check.max_points} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
