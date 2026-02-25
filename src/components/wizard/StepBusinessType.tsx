import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { BusinessType } from '../../types/builder';
import { 
  Scissors, 
  Sparkles, 
  Utensils, 
  Brain, 
  ShoppingBag, 
  Wrench, 
  BookOpen, 
  Church, 
  LayoutGrid 
} from 'lucide-react';
import { motion } from 'motion/react';

const businessTypes: { type: BusinessType; label: string; icon: any }[] = [
  { type: 'barbershop', label: 'Barbershop', icon: Scissors },
  { type: 'salon', label: 'Salon / Beauty', icon: Sparkles },
  { type: 'restaurant', label: 'Restaurant / Food', icon: Utensils },
  { type: 'consultant', label: 'Consultant / Coach', icon: Brain },
  { type: 'store', label: 'Online Store', icon: ShoppingBag },
  { type: 'mechanic', label: 'Mechanic / Auto', icon: Wrench },
  { type: 'tutor', label: 'Tutor / Educator', icon: BookOpen },
  { type: 'church', label: 'Church / Ministry', icon: Church },
  { type: 'other', label: 'Other', icon: LayoutGrid },
];

const StepBusinessType: React.FC = () => {
  const { state, dispatch } = useBuilder();
  const [customType, setCustomType] = useState(state.data.customType || '');

  const handleSelect = (type: BusinessType) => {
    dispatch({ type: 'SET_BUSINESS_TYPE', payload: { type, customType: type === 'other' ? customType : undefined } });
    if (type !== 'other') {
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {businessTypes.map(({ type, label, icon: Icon }) => (
          <motion.div
            key={type}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            <Card
              selected={state.data.businessType === type}
              onClick={() => handleSelect(type)}
              className="h-full flex flex-col items-center justify-center text-center gap-4 py-8 transition-shadow hover:shadow-lg"
            >
              <div className={state.data.businessType === type ? 'text-[var(--brand-color)]' : 'text-zinc-400'}>
                <Icon className="w-10 h-10" />
              </div>
              <span className="font-bold text-zinc-900">{label}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      {state.data.businessType === 'other' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border-2 border-zinc-100 space-y-4"
        >
          <Input
            label="What kind of business?"
            placeholder="e.g. Pet Grooming, Yoga Studio..."
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end">
             <button 
               onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
               disabled={!customType.trim()}
               className="text-[var(--brand-color)] font-bold hover:underline disabled:opacity-50"
             >
               Next Step →
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StepBusinessType;
