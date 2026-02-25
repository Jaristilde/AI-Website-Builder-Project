import React, { useState } from 'react';
import { useGoogle } from '../../context/GoogleContext';
import { Calendar, Clock, User, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const AppointmentsPanel: React.FC = () => {
  const { appointments, addAppointment } = useGoogle();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    service: '',
    date: '',
    time: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      ...formData,
      status: 'confirmed'
    });
    setFormData({ clientName: '', service: '', date: '', time: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-zinc-900">Appointments</h2>
          <p className="text-zinc-500 font-medium">Manage your upcoming bookings.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="rounded-xl h-11 px-6">
          <Plus className="w-4 h-4 mr-2" /> New Appointment
        </Button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-zinc-900">Add Appointment</h3>
            <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-zinc-50 rounded-full">
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Client Name" 
              required 
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
            <Input 
              label="Service" 
              required 
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            />
            <Input 
              label="Date" 
              type="date" 
              required 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input 
              label="Time" 
              type="time" 
              required 
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <Button variant="ghost" type="button" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" className="px-8">Save Appointment</Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center justify-between hover:border-purple-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">{apt.clientName}</h4>
                  <p className="text-sm text-zinc-500">{apt.service}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-sm">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    {apt.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <Clock className="w-3.5 h-3.5 text-zinc-300" />
                    {apt.time}
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {apt.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-16 rounded-[40px] border border-zinc-100 shadow-sm text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto">
              <Calendar className="w-10 h-10 text-zinc-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900">No appointments yet.</h3>
              <p className="text-zinc-500 max-w-sm mx-auto">
                Add your first one to get started with your schedule!
              </p>
            </div>
            <Button onClick={() => setShowAdd(true)} variant="outline" className="rounded-xl">
              Add Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
