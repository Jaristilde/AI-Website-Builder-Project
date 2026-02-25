import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-medium text-zinc-700 ml-1">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-2.5 bg-white border-2 border-zinc-100 rounded-xl outline-none transition-all focus:border-[var(--brand-color)] focus:ring-2 focus:ring-[var(--brand-color)]/10',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};
