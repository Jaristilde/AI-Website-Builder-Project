import React, { useState } from 'react';
import { useGoogle } from '../../context/GoogleContext';
import { User, Mail, Phone, Plus, X, Search, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const ClientsPanel: React.FC = () => {
  const { clients, addClient } = useGoogle();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      ...formData,
      totalSpent: 0,
      lastVisit: new Date().toLocaleDateString()
    });
    setFormData({ name: '', email: '', phone: '' });
    setShowAdd(false);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-zinc-900">Clients</h2>
          <p className="text-zinc-500 font-medium">Keep track of your customer base.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="rounded-xl h-11 px-6">
          <Plus className="w-4 h-4 mr-2" /> Add Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input 
          type="text"
          placeholder="Search clients by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-14 pl-12 pr-4 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
        />
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-zinc-900">Add New Client</h3>
            <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-zinc-50 rounded-full">
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input 
              label="Email Address" 
              type="email"
              required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input 
              label="Phone Number" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <Button variant="ghost" type="button" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" className="px-8">Save Client</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div key={client.id} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:border-purple-200 transition-all space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 font-bold text-xl">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-zinc-900 text-lg">{client.name}</h4>
                  <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {client.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Spent</p>
                  <p className="font-bold text-zinc-900 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    {client.totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Last Visit</p>
                  <p className="font-bold text-zinc-900">{client.lastVisit}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a 
                  href={`tel:${client.phone}`}
                  className="flex-1 h-10 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a 
                  href={`mailto:${client.email}`}
                  className="flex-1 h-10 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-16 rounded-[40px] border border-zinc-100 shadow-sm text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto">
              <User className="w-10 h-10 text-zinc-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900">Add your first client to get started.</h3>
              <p className="text-zinc-500 max-w-sm mx-auto">
                Keep all your customer details in one place for easy access.
              </p>
            </div>
            <Button onClick={() => setShowAdd(true)} variant="outline" className="rounded-xl">
              Add Client
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
