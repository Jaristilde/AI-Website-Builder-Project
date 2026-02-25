import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-200',
        selected ? 'border-[var(--brand-color)] ring-2 ring-[var(--brand-color)]/20 shadow-md' : 'border-zinc-100 hover:border-zinc-200 hover:shadow-md',
        onClick && 'cursor-pointer active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  );
};
