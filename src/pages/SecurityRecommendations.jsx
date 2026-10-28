import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Lightbulb, CheckCircle2, ShieldAlert, BookOpen, Filter } from 'lucide-react';
import { SecurityBadge } from '../components/SecurityBadge';

export const SecurityRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await api.get('/security/recommendations');
        setRecommendations(res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-600">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mb-3"></div>
        <p className=" text-xs uppercase tracking-widest text-blue-700">
          Loading Security Architecture Recommendations...
        </p>
      </div>
    );
  }

  const implemented = recommendations?.implemented || [];
  const enterprise = recommendations?.enterprise_production || [];

  const itemsToDisplay =
    activeTab === 'IMPLEMENTED'
      ? implemented
      : activeTab === 'ENTERPRISE'
      ? enterprise
      : [...implemented, ...enterprise];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-700" />
          <span>SECURITY RECOMMENDATIONS & ROADMAP</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 ">
          ACADEMIC DEFENSIVE IMPLEMENTATIONS VS. ENTERPRISE ARCHITECTURE
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs ">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === 'ALL'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>All Recommendations</span>
          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
            {implemented.length + enterprise.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('IMPLEMENTED')}
          className={`px-3.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === 'IMPLEMENTED'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Implemented in Academic Build</span>
          <span className="text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-700">
            {implemented.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ENTERPRISE')}
          className={`px-3.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === 'ENTERPRISE'
              ? 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Enterprise Production Next Steps</span>
          <span className="text-[10px] bg-amber-50 px-1.5 py-0.5 rounded text-amber-700">
            {enterprise.length}
          </span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itemsToDisplay.map((item) => {
          const isImplemented = item.status === 'IMPLEMENTED';
          return (
            <div
              key={item.id}
              className={`p-5 rounded-lg border transition-all ${
                isImplemented
                  ? 'bg-white border-slate-200 hover:border-emerald-300'
                  : 'bg-slate-50 border-slate-200 border-dashed hover:border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs text-slate-500">{item.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                      {item.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      OWASP: {item.owasp_mapping}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 ">{item.title}</h3>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded border flex-shrink-0 ${
                    isImplemented
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {isImplemented ? 'IMPLEMENTED' : 'ENTERPRISE NEXT STEP'}
                </span>
              </div>

              <p className="text-xs text-slate-700 mb-3 leading-relaxed">{item.description}</p>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="text-blue-700 font-semibold">Security Rationale: </span>
                <span className="text-slate-700 font-sans">{item.rationale}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
