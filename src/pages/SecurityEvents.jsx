import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  ScrollText, 
  Search, 
  Filter, 
  RotateCw, 
  ShieldAlert, 
  Clock, 
  Terminal,
  Download
} from 'lucide-react';
import { SecurityBadge } from '../components/SecurityBadge';

export const SecurityEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      setRefreshing(true);
      const params = {};
      if (severityFilter) params.severity = severityFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/security-events', { params });
      setEvents(res.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch security events.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [severityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 rounded">
              SOC AUDIT TRAIL
            </span>
            <span className="text-xs text-slate-600">Tamper-Resistant Security Logging</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-purple-700" />
            <span>SECURITY AUDIT & EVENT LOGS</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 ">
            REAL-TIME DEFENSIVE TELEMETRY & ATTACK DETECTION RECORDS
          </p>
        </div>

        <button
          onClick={fetchEvents}
          disabled={refreshing}
          className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs rounded-md transition-colors flex items-center gap-2"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-purple-700' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs ">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Severity Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <span className="text-xs text-slate-600 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['', 'INFO', 'WARNING', 'HIGH'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-md text-xs transition-colors ${
                severityFilter === sev
                  ? 'bg-purple-700 text-slate-900 font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {sev === '' ? 'ALL' : sev}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search description, event type, username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-20 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 "
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-purple-700 hover:bg-purple-800 text-slate-900 text-[11px] rounded font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <span>Displaying {events.length} security audit records</span>
          <span className="text-blue-700">Sanitized: Zero Password/Secret Disclosure</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">User / Identity</th>
                <th className="px-4 py-3">Client IP</th>
                <th className="px-4 py-3">Sanitized Audit Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {events.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                    <Terminal className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p>No matching security events recorded in audit log.</p>
                  </td>
                </tr>
              ) : (
                events.map((evt) => {
                  const dateStr = new Date(evt.timestamp).toLocaleString();
                  return (
                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-[11px]">
                        {dateStr}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SecurityBadge status={evt.severity} size="xs" />
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                        {evt.event_type}
                      </td>
                      <td className="px-4 py-3 text-blue-700 whitespace-nowrap">
                        {evt.username ? `@${evt.username}` : 'SYSTEM'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-[11px]">
                        {evt.ip_address || '127.0.0.1'}
                      </td>
                      <td className="px-4 py-3 text-slate-700 min-w-[280px]">
                        {evt.description}
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
