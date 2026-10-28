import React from 'react';
import { Check, X } from 'lucide-react';

export const PasswordMeter = ({ password = '' }) => {
  const requirements = [
    { id: 'length', label: 'Minimum 10 characters', met: password.length >= 10 },
    { id: 'upper', label: 'Uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'Lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'Numerical digit (0-9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'Special symbol (!@#$%^&*...)', met: /[!@#$%^&*(),.?":{}|<>\-_=+\\/~`]/.test(password) },
  ];

  const passedCount = requirements.filter((r) => r.met).length;
  const scorePercent = (passedCount / requirements.length) * 100;

  let scoreColor = 'bg-red-600';
  let strengthLabel = 'Very Weak';

  if (passedCount === 5) {
    scoreColor = 'bg-emerald-600 shadow-sm';
    strengthLabel = 'Strong (Cryptographically Compliant)';
  } else if (passedCount >= 3) {
    scoreColor = 'bg-amber-500';
    strengthLabel = 'Moderate';
  } else if (passedCount > 0) {
    scoreColor = 'bg-red-600 shadow-sm';
    strengthLabel = 'Weak';
  }

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-3">
      <div className="flex justify-between items-center text-xs ">
        <span className="text-slate-600">Password Strength:</span>
        <span className={passedCount === 5 ? 'text-emerald-700 font-semibold' : passedCount >= 3 ? 'text-amber-700' : 'text-red-700'}>
          {strengthLabel}
        </span>
      </div>

      {/* Strength Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${scoreColor}`}
          style={{ width: `${scorePercent}%` }}
        />
      </div>

      {/* Requirement Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {requirements.map((req) => (
          <div
            key={req.id}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              req.met ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
