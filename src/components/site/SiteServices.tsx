import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Card } from '../ui/card';
import { motion } from 'motion/react';

const SiteServices: React.FC = () => {
  const { state } = useBuilder();
  const isRestaurant = state.data.businessType === 'restaurant';

  return (
    <section id="services" className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-sm font-bold text-[var(--brand-color)] uppercase tracking-widest">
            {isRestaurant ? 'Our Menu' : 'Our Services'}
          </span>
          <h2 className="text-4xl font-black text-zinc-900">
            {isRestaurant ? 'Delicious Offerings' : 'Professional Services'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {state.data.services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col p-8 hover:border-[var(--brand-color)]/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-zinc-900">{service.name}</h3>
                  {service.price && (
                    <span className="text-lg font-black text-[var(--brand-color)]">
                      {service.price}
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-zinc-500 leading-relaxed">
                    {service.description}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SiteServices;
