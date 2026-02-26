import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isBuilder = location.pathname === '/builder';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Login', path: '/login' },
  ];

  return (
    <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group transition-opacity hover:opacity-80">
          <img src="/my1stwebsite_logo_purple.png" alt="My1stWebsite" className="h-16 group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-bold transition-colors",
                location.pathname === link.path ? "text-purple-600" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {!isBuilder && (
            <Link to="/builder">
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6 font-bold shadow-lg shadow-purple-100">
                Build My Website <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
          {isBuilder && (
            <Link to="/">
              <Button variant="ghost" className="font-bold text-zinc-500 hover:text-zinc-900">
                Exit Builder
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-zinc-500 hover:text-zinc-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-xl font-bold text-zinc-900"
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/builder" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold text-lg shadow-lg shadow-purple-100">
                  Build My Website
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
