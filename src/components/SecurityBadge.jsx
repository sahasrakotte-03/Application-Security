import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, ShieldAlert } from 'lucide-react';

export const SecurityBadge = ({ status, size = 'sm', showIcon = true }) => {
  const norm = (status || '').toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
  let Icon = Info;

  switch (norm) {
    case 'PASS':
    case 'ACTIVE':
    case 'SUCCESS':
    case 'IMPLEMENTED':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      Icon = CheckCircle2;
      break;
    case 'WARNING':
    case 'MEDIUM':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      Icon = AlertTriangle;
      break;
    case 'FAIL':
    case 'HIGH':
    case 'LOCKED':
    case 'DANGER':
      colorClasses = 'bg-red-50 text-red-700 border-red-200';
      Icon = ShieldAlert;
      break;
    case 'INFO':
    case 'USER':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      Icon = Info;
      break;
    case 'ADMIN':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      Icon = CheckCircle2;
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
      Icon = Info;
  }

  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-md border ${colorClasses} ${sizeClasses}`}>
      {showIcon && <Icon className={size === 'xs' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{norm}</span>
    </span>
  );
};
