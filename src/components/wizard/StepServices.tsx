import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Trash2, Plus, Edit3, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const StepServices: React.FC = () => {
  const { state, dispatch } = useBuilder();
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateService = (id: string, field: string, value: string) => {
    const newServices = state.data.services.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    dispatch({ type: 'UPDATE_SERVICES', payload: newServices });
  };

  const deleteService = (id: string) => {
    const newServices = state.data.services.filter(s => s.id !== id);
    dispatch({ type: 'UPDATE_SERVICES', payload: newServices });
  };

  const addService = () => {
    const id = Math.random().toString(36).slice(2, 9);
    const newService = { id, name: 'New Service', price: '$0', description: '' };
    dispatch({ type: 'UPDATE_SERVICES', payload: [...state.data.services, newService] });
    setEditingId(id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
        <p className="text-emerald-800 text-sm font-medium">
          ✨ We've added common services for your business. Edit or add your own!
        </p>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {state.data.services.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-4 flex items-center justify-between gap-4 group">
                {editingId === service.id ? (
                  <div className="flex-1 flex items-center gap-3">
                    <Input
                      value={service.name}
                      onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      className="flex-[2]"
                      autoFocus
                    />
                    <Input
                      value={service.price}
                      onChange={(e) => updateService(service.id, 'price', e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => setEditingId(null)}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="font-bold text-zinc-900">{service.name}</h3>
                      {service.description && <p className="text-sm text-zinc-500">{service.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-zinc-900">{service.price}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(service.id)}
                          className="p-2 h-auto text-zinc-400 hover:text-zinc-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteService(service.id)}
                          className="p-2 h-auto text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        onClick={addService}
        className="w-full border-dashed border-2 py-6 flex items-center gap-2 rounded-2xl transition-all active:scale-[0.98] hover:bg-zinc-50"
      >
        <Plus className="w-5 h-5" />
        Add Another Service
      </Button>
    </div>
  );
};

export default StepServices;
