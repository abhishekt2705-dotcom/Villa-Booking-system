import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    },
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    },
  };

  const current = styles[type] || styles.error;

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-3 text-sm font-medium transition-all ${current.bg}`}>
      {current.icon}
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-sm font-bold ml-2"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
