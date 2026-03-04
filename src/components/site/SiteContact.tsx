import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { useGoogle } from '../../context/GoogleContext';
import { submitLead } from '../../lib/google';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Phone, Mail, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const SiteContact: React.FC = () => {
  const { state } = useBuilder();
  const { isConnected, connection } = useGoogle();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      console.log('Lead data (Google Sheets not connected):', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '', service: '' });
      return;
    }

    setLoading(true);
    try {
      const result = await submitLead(connection.appsScriptUrl!, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        service: formData.service
      });

      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '', service: '' });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <span className="text-sm font-bold text-[var(--brand-color)] uppercase tracking-widest">Contact Us</span>
              <h2 className="text-4xl font-black text-zinc-900">Get In Touch</h2>
              <p className="text-xl text-zinc-500 max-w-md">
                Have questions or ready to book? Reach out to us and we'll be happy to help.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-zinc-100">
                <div className="w-12 h-12 bg-purple-50 text-[var(--brand-color)] rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Phone</p>
                  <p className="text-lg font-bold text-zinc-900">{state.data.phone || '(555) 000-0000'}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-zinc-100">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Email</p>
                  <p className="text-lg font-bold text-zinc-900">{state.data.email || 'hello@yourbusiness.com'}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-zinc-100">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Location</p>
                  <p className="text-lg font-bold text-zinc-900">{state.data.city}, {state.data.state}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl shadow-zinc-200/50 border border-zinc-100"
          >
            {success ? (
              <div className="text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-zinc-900">Message Sent!</h3>
                  <p className="text-zinc-500">Thanks for reaching out. We'll get back to you soon.</p>
                </div>
                <Button 
                  onClick={() => setSuccess(false)}
                  variant="ghost"
                  className="text-[var(--brand-color)] font-bold"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Name" 
                    placeholder="Your Name" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input 
                    label="Phone" 
                    placeholder="(555) 000-0000" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <Input 
                  label="Email Address" 
                  type="email" 
                  placeholder="john@example.com" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 ml-1">Service Interested In</label>
                  <select
                    className="w-full px-4 py-3 bg-white border-2 border-zinc-100 rounded-2xl outline-none focus:border-[var(--brand-color)]"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="">Select a service</option>
                    {state.data.services.map((s, i) => (
                      <option key={i} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 ml-1">Message</label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border-2 border-zinc-100 rounded-2xl outline-none focus:border-[var(--brand-color)] min-h-[150px]"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-lg rounded-2xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SiteContact;
