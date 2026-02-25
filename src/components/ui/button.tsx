import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-[var(--brand-color)] text-white hover:opacity-90 shadow-sm',
    outline: 'border-2 border-[var(--brand-color)] text-[var(--brand-color)] bg-transparent hover:bg-[var(--brand-color)] hover:text-white',
    ghost: 'text-[var(--brand-color)] bg-transparent hover:bg-[var(--brand-color)]/10',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg font-semibold',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
