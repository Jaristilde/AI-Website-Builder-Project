import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Input } from '../ui/input';
import { motion } from 'motion/react';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const placeholders: Record<string, { name: string; tagline: string }> = {
  barbershop: { name: "e.g., King's Cuts Barbershop", tagline: "e.g., Where Style Meets Tradition" },
  salon: { name: "e.g., Glamour Studio", tagline: "e.g., Your Beauty, Our Passion" },
  restaurant: { name: "e.g., Mama Rosa's Kitchen", tagline: "e.g., Authentic Flavors, Made With Love" },
  consultant: { name: "e.g., Sarah Chen Coaching", tagline: "e.g., Transform Your Life, One Step at a Time" },
  store: { name: "e.g., The Local Boutique", tagline: "e.g., Quality Goods, Locally Sourced" },
  mechanic: { name: "e.g., Reliable Auto Repair", tagline: "e.g., Quality Service You Can Trust" },
  tutor: { name: "e.g., Bright Minds Tutoring", tagline: "e.g., Empowering Students to Succeed" },
  church: { name: "e.g., Grace Community Church", tagline: "e.g., A Place to Belong" },
  other: { name: "e.g., Your Business Name", tagline: "e.g., Your Business Tagline" },
};

const StepBusinessInfo: React.FC = () => {
  const { state, dispatch } = useBuilder();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const type = state.data.businessType;
  const currentPlaceholders = placeholders[type] || placeholders.other;

  const handleChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: { [field]: value } });
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
        <p className="text-purple-800 text-sm font-medium">
          ✨ Almost there! Just a few details about your business. This info will appear on your website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Business Name *"
            placeholder={currentPlaceholders.name}
            value={state.data.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            error={errors.businessName}
          />
        </div>

        <Input
          label="Your Name (Optional)"
          placeholder="e.g., John Smith"
          value={state.data.ownerName}
          onChange={(e) => handleChange('ownerName', e.target.value)}
        />

        <Input
          label="Tagline (Optional)"
          placeholder={currentPlaceholders.tagline}
          value={state.data.tagline}
          onChange={(e) => handleChange('tagline', e.target.value)}
        />

        <Input
          label="City *"
          placeholder="e.g., Miami"
          value={state.data.city}
          onChange={(e) => handleChange('city', e.target.value)}
          error={errors.city}
        />

        <div className="space-y-1.5 w-full">
          <label className="text-sm font-medium text-zinc-700 ml-1">State *</label>
          <select
            className="w-full px-4 py-2.5 bg-white border-2 border-zinc-100 rounded-xl outline-none transition-all focus:border-[var(--brand-color)] focus:ring-2 focus:ring-[var(--brand-color)]/10"
            value={state.data.state}
            onChange={(e) => handleChange('state', e.target.value)}
          >
            <option value="">Select State</option>
            {US_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <Input
          label="Phone (Optional)"
          placeholder="(305) 555-1234"
          value={state.data.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />

        <Input
          label="Email (Optional)"
          placeholder="hello@yourbusiness.com"
          value={state.data.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>
    </div>
  );
};

export default StepBusinessInfo;
