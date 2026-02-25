import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { motion } from 'motion/react';
import { DesignStyle } from '../../types/builder';
import { Check } from 'lucide-react';

interface StyleOption {
  id: DesignStyle;
  label: string;
  description: string;
  palette: string[];
}

const styleOptions: StyleOption[] = [
  { id: 'modern', label: 'Modern', description: 'Clean lines, white space', palette: ['#3B82F6', '#FFFFFF', '#F3F4F6', '#1F2937'] },
  { id: 'luxury', label: 'Luxury', description: 'Dark backgrounds, gold accents', palette: ['#D97706', '#000000', '#111827', '#FFFFFF'] },
  { id: 'minimal', label: 'Minimal', description: 'Ultra-simple, content-focused', palette: ['#4B5563', '#FFFFFF', '#F9FAFB', '#D1D5DB'] },
  { id: 'bold', label: 'Bold', description: 'Big typography, bright colors', palette: ['#7C3AED', '#FFFFFF', '#F3F4F6', '#000000'] },
  { id: 'dark', label: 'Dark', description: 'Dark theme, sleek professional', palette: ['#10B981', '#111827', '#1F2937', '#FFFFFF'] },
  { id: 'warm', label: 'Warm', description: 'Earth tones, friendly, inviting', palette: ['#B45309', '#FFFBEB', '#FEF3C7', '#78350F'] },
];

const presetColors = [
  { name: 'Deep Blue', hex: '#1E40AF' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Orange', hex: '#EA580C' },
  { name: 'Slate', hex: '#475569' },
  { name: 'Black', hex: '#18181B' },
];

const StepDesignStyle: React.FC = () => {
  const { state, dispatch } = useBuilder();

  const handleStyleSelect = (style: DesignStyle) => {
    dispatch({ type: 'UPDATE_DESIGN', payload: { style, color: state.data.brandColor } });
  };

  const handleColorSelect = (color: string) => {
    dispatch({ type: 'UPDATE_DESIGN', payload: { style: state.data.designStyle, color } });
  };

  const isValidHex = (hex: string) => /^#[0-9A-F]{6}$/i.test(hex);

  return (
    <div className="space-y-12">
      {/* Style Selection */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">How should your site feel?</h2>
          <p className="text-zinc-500">Choose a design style that matches your brand.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {styleOptions.map((style) => (
            <motion.div 
              key={style.id} 
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                selected={state.data.designStyle === style.id}
                onClick={() => handleStyleSelect(style.id)}
                className="h-full flex flex-col gap-3 p-4 relative overflow-hidden"
              >
                {state.data.designStyle === style.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--brand-color)] rounded-full flex items-center justify-center text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-zinc-900">{style.label}</span>
                  <span className="text-xs text-zinc-500">{style.description}</span>
                </div>
                <div className="flex gap-1 mt-auto">
                  {style.palette.map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-zinc-100" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Pick your brand color</h2>
          <p className="text-zinc-500">This will be the main accent color on your site.</p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {presetColors.map((color) => (
            <motion.button
              key={color.hex}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColorSelect(color.hex)}
              className={`w-12 h-12 rounded-full border-4 transition-all relative flex items-center justify-center ${
                state.data.brandColor === color.hex ? 'border-zinc-200 ring-2 ring-[var(--brand-color)]' : 'border-transparent'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {state.data.brandColor === color.hex && <Check className="w-6 h-6 text-white" />}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <span className="text-sm font-medium text-zinc-700">Or enter your own:</span>
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg border-2 border-zinc-100 shadow-sm transition-colors" 
              style={{ backgroundColor: isValidHex(state.data.brandColor) ? state.data.brandColor : '#000000' }} 
            />
            <Input
              value={state.data.brandColor}
              onChange={(e) => {
                const val = e.target.value;
                if (val.startsWith('#') || val === '') {
                  handleColorSelect(val);
                }
              }}
              className={`w-32 py-1.5 ${!isValidHex(state.data.brandColor) && state.data.brandColor !== '' ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* Live Preview Strip */}
      <div className="bg-white border-2 border-zinc-100 rounded-2xl p-6 space-y-4">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Color Preview</span>
        <div className="flex items-center gap-6">
          <button 
            className="px-6 py-2 rounded-xl text-white font-bold transition-all" 
            style={{ backgroundColor: isValidHex(state.data.brandColor) ? state.data.brandColor : '#000000' }}
          >
            Button
          </button>
          <h3 
            className="text-xl font-black" 
            style={{ color: isValidHex(state.data.brandColor) ? state.data.brandColor : '#000000' }}
          >
            Heading Text
          </h3>
          <div 
            className="h-1 flex-1 rounded-full" 
            style={{ backgroundColor: isValidHex(state.data.brandColor) ? state.data.brandColor : '#000000' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default StepDesignStyle;
