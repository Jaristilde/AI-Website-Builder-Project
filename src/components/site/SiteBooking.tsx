import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { businessTemplates } from '../../lib/templates';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const SiteBooking: React.FC = () => {
  const { state } = useBuilder();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    service: '',
  });

  if (!state.data.features.booking) return null;

  const template = businessTemplates[state.data.businessType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({ name: '', phone: '', date: '', time: '', service: '' });
  };

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
            </div>

            <div className="bg-white rounded-3xl p-8 text-zinc-900 shadow-2xl">
              {success ? (
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900">Booking Requested!</h3>
                  <p className="text-zinc-500">
                    Thanks! We'll contact you shortly to confirm your appointment.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-[var(--brand-color)] font-bold hover:underline text-sm"
                  >
                    Book another appointment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      className="border-zinc-100"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      placeholder="Phone Number"
                      className="border-zinc-100"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      className="border-zinc-100"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <Input
                      type="time"
                      className="border-zinc-100"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                  <select
                    className="w-full px-4 py-2.5 bg-white border-2 border-zinc-100 rounded-xl outline-none focus:border-[var(--brand-color)]"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="">Select Service</option>
                    {state.data.services.map(s => (
                      <option key={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <Button type="submit" className="w-full py-4 text-lg rounded-xl">
                    Request Booking
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteBooking;
