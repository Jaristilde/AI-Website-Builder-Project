import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { businessTemplates } from '../../lib/templates';

const SiteNavbar: React.FC = () => {
  const { state } = useBuilder();
  const [isOpen, setIsOpen] = useState(false);
  const template = businessTemplates[state.data.businessType];

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-2xl font-black tracking-tight text-zinc-900">
          {state.data.businessName || 'Your Business'}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-zinc-600 hover:text-[var(--brand-color)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" className="rounded-full">
            {template?.ctaText || 'Get Started'}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-zinc-100 p-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-zinc-900"
            >
              {link.label}
            </a>
          ))}
          <Button className="w-full rounded-xl">
            {template?.ctaText || 'Get Started'}
          </Button>
        </div>
      )}
    </nav>
  );
};

export default SiteNavbar;
