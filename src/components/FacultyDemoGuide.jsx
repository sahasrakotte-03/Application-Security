import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FacultyDemoGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const steps = [
    { num: 1, title: 'Open Register Page', action: () => navigate('/register'), desc: 'Navigate to user registration form.' },
    { num: 2, title: 'Demonstrate Password Validation Failure', desc: 'Try weak password (e.g. "pass123") and observe live strength meter & backend rejection.' },
    { num: 3, title: 'Register Valid User', desc: 'Register with compliant credentials (e.g., username "alice", password "Secure#Alice2026!").' },
    { num: 4, title: 'Login Successfully', action: () => navigate('/login'), desc: 'Authenticate with newly created user and receive cryptographically signed JWT.' },
    { num: 5, title: 'Inspect User Dashboard', action: () => navigate('/dashboard'), desc: 'Observe user personal security metrics, profile metadata, and token state.' },
    { num: 6, title: 'View Security Overview', action: () => navigate('/security-status'), desc: 'Inspect the 10 automated defensive checks and dynamic Security Score (e.g. 95/100).' },
    { num: 7, title: 'Test RBAC Enforcement (403 Forbidden)', action: () => navigate('/admin/dashboard'), desc: 'Attempt to navigate to Admin Dashboard as standard USER; observe backend 403 Forbidden.' },
    { num: 8, title: 'Login as ADMIN', action: () => navigate('/login'), desc: 'Login with administrative credentials (admin / AdminSecured#2026!).' },
    { num: 9, title: 'Inspect Admin SOC Dashboard', action: () => navigate('/admin/dashboard'), desc: 'Review user registry, role distributions, security audit logs, and SOC metrics.' },
    { num: 10, title: 'Demonstrate Login Protection & Lockout', action: () => navigate('/admin/security-events'), desc: 'Show brute-force defense logs and account lockout events.' },
    { num: 11, title: 'Review Security Recommendations', action: () => navigate('/security-recommendations'), desc: 'Compare implemented academic controls vs enterprise production roadmap.' },
    { num: 12, title: 'Inspect FastAPI OpenAPI Swagger Docs', action: () => window.open('http://127.0.0.1:8000/docs', '_blank'), desc: 'Review interactive Swagger UI with Bearer JWT security schemas.' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full">
      <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden transition-all duration-300">
        {/* Header Bar */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-4 py-2.5 bg-slate-50 cursor-pointer border-b border-blue-200"
        >
          <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold">
            <Terminal className="w-4 h-4 text-blue-700" />
            <span>FACULTY DEMO FLOW (12 STEPS)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Step {currentStep}/12
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronUp className="w-4 h-4 text-slate-600" />}
          </div>
        </div>

        {/* Expandable Body */}
        {isOpen && (
          <div className="p-4 max-h-96 overflow-y-auto space-y-2.5 text-xs">
            <div className="text-slate-600 pb-2 border-b border-slate-200 flex justify-between items-center">
              <span>Interactive faculty evaluation walkthrough:</span>
              <span className=" text-blue-700 text-[10px]">Project 4 Guidelines</span>
            </div>

            <div className="space-y-2">
              {steps.map((step) => {
                const isCurrent = step.num === currentStep;
                const isPassed = step.num < currentStep;

                return (
                  <div
                    key={step.num}
                    onClick={() => {
                      setCurrentStep(step.num);
                      if (step.action) step.action();
                    }}
                    className={`p-2.5 rounded-md border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-600 text-slate-900 shadow-sm'
                        : isPassed
                        ? 'bg-slate-900/50 border-slate-200 text-slate-600 hover:border-slate-400'
                        : 'bg-slate-900/30 border-slate-900 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium">
                        {isPassed ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        ) : (
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCurrent ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {step.num}
                          </span>
                        )}
                        <span className={isCurrent ? 'text-blue-700 font-semibold' : ''}>{step.title}</span>
                      </div>
                      {step.action && <ExternalLink className="w-3 h-3 text-slate-500" />}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 pl-6 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <button
                disabled={currentStep <= 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-40 text-xs hover:bg-slate-200"
              >
                Previous
              </button>
              <button
                disabled={currentStep >= 12}
                onClick={() => {
                  const next = Math.min(12, currentStep + 1);
                  setCurrentStep(next);
                  if (steps[next - 1]?.action) steps[next - 1].action();
                }}
                className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
