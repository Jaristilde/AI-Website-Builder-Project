import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Card } from '../ui/card';
import { 
  CalendarCheck, 
  CreditCard, 
  Images, 
  UtensilsCrossed, 
  DollarSign, 
  Star, 
  MapPin, 
  Share2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { BusinessFeatures } from '../../types/builder';

interface FeatureConfig {
  id: keyof BusinessFeatures;
  label: string;
  description: string;
  icon: any;
}

const features: FeatureConfig[] = [
  { id: 'booking', label: 'Online Booking', description: 'Let clients book appointments on your site', icon: CalendarCheck },
  { id: 'payments', label: 'Accept Payments', description: 'Take payments or deposits online', icon: CreditCard },
  { id: 'gallery', label: 'Photo Gallery', description: 'Show off your work with photos', icon: Images },
  { id: 'menu', label: 'Food Menu', description: 'Display your menu with prices', icon: UtensilsCrossed },
  { id: 'priceList', label: 'Price List', description: 'Show your services and prices', icon: DollarSign },
  { id: 'testimonials', label: 'Customer Reviews', description: 'Show what your clients are saying', icon: Star },
  { id: 'map', label: 'Map & Directions', description: 'Help clients find your location', icon: MapPin },
  { id: 'socialMedia', label: 'Social Media Links', description: 'Connect your Instagram, Facebook, etc.', icon: Share2 },
];

const StepFeatures: React.FC = () => {
  const { state, dispatch } = useBuilder();

  const toggleFeature = (id: keyof BusinessFeatures) => {
    const newFeatures = {
      ...state.data.features,
      [id]: !state.data.features[id],
    };
    dispatch({ type: 'UPDATE_FEATURES', payload: newFeatures });
  };

  // Filter features based on business type (e.g., only show menu for restaurants)
  const filteredFeatures = features.filter(f => {
    if (f.id === 'menu' && state.data.businessType !== 'restaurant') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
        <p className="text-indigo-800 text-sm font-medium">
          🚀 These features are recommended for your business. Toggle them on or off!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            whileTap={{ scale: 0.99 }}
          >
            <Card
              selected={state.data.features[feature.id]}
              onClick={() => toggleFeature(feature.id)}
              className="flex items-center gap-4 p-5"
            >
              <div className={state.data.features[feature.id] ? 'text-[var(--brand-color)]' : 'text-zinc-400'}>
                <feature.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900">{feature.label}</h3>
                <p className="text-sm text-zinc-500">{feature.description}</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${state.data.features[feature.id] ? 'bg-[var(--brand-color)]' : 'bg-zinc-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${state.data.features[feature.id] ? 'left-7' : 'left-1'}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StepFeatures;
