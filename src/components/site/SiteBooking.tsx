import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { businessTemplates } from '../../lib/templates';
import { motion } from 'motion/react';

const SiteBooking: React.FC = () => {
  const { state } = useBuilder();
  if (!state.data.features.booking) return null;

  const template = businessTemplates[state.data.businessType];

  return (
    <section id="booking" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-[var(--brand-color)] rounded-[48px] p-8 md:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                {template?.ctaText || 'Book an Appointment'}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Ready to get started? Fill out the form and we'll get back to you as soon as possible to confirm your time.
              </p>
              <div className="pt-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <p className="text-sm font-medium">
                  💡 Online booking coming soon! For now, call us at {state.data.phone || '(555) 000-0000'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 space-y-4 text-zinc-900 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Your Name" className="border-zinc-100" />
                <Input placeholder="Phone Number" className="border-zinc-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" className="border-zinc-100" />
                <Input type="time" className="border-zinc-100" />
              </div>
              <select className="w-full px-4 py-2.5 bg-white border-2 border-zinc-100 rounded-xl outline-none focus:border-[var(--brand-color)]">
                <option>Select Service</option>
                {state.data.services.map(s => (
                  <option key={s.id}>{s.name}</option>
                ))}
              </select>
              <Button className="w-full py-4 text-lg rounded-xl">
                Request Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteBooking;
