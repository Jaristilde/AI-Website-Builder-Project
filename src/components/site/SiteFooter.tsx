import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const SiteFooter: React.FC = () => {
  const { state } = useBuilder();

  return (
    <footer className="bg-zinc-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight">
              {state.data.businessName || 'Your Business'}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {state.data.tagline || 'Providing professional services to our community since 2026.'}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-[var(--brand-color)] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-[var(--brand-color)] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-[var(--brand-color)] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-zinc-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4 text-zinc-400">
              <li>{state.data.city}, {state.data.state}</li>
              <li>{state.data.phone || '(555) 000-0000'}</li>
              <li>{state.data.email || 'hello@yourbusiness.com'}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Hours</h3>
            <ul className="space-y-4 text-zinc-400">
              <li className="flex justify-between"><span>Mon - Fri</span> <span>9am - 6pm</span></li>
              <li className="flex justify-between"><span>Saturday</span> <span>10am - 4pm</span></li>
              <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <p>© 2026 {state.data.businessName || 'Your Business'}. All rights reserved.</p>
          <p>Powered by AI Website Builder</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
