import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, ArrowRight, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isBuilder = location.pathname === '/builder';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    ...(user ? [] : [{ name: 'Login', path: '/login' }]),
  ];

  return (
    <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group transition-opacity hover:opacity-80">
          <img src="/my1stwebsite_logo_purple.png" alt="My1stWebsite" className="h-24 group-hover:scale-105 transition-transform" />
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

        {/* Desktop CTA / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-zinc-50 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-zinc-700 max-w-[160px] truncate">
                  {user.email}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform", isUserMenuOpen && "rotate-180")} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="text-xs text-zinc-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-zinc-700 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
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
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-xl font-bold text-zinc-900">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="block text-xl font-bold text-red-600"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link to="/builder" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold text-lg shadow-lg shadow-purple-100">
                    Build My Website
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
