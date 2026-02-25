import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { motion } from 'motion/react';

const SitePricing: React.FC = () => {
  const { state } = useBuilder();
  if (!state.data.features.priceList) return null;

  return (
    <section id="pricing" className="py-24 bg-zinc-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-sm font-bold text-[var(--brand-color)] uppercase tracking-widest">Pricing</span>
          <h2 className="text-4xl font-black text-zinc-900">Simple & Transparent</h2>
        </div>

        <div className="bg-white rounded-[40px] shadow-xl shadow-zinc-200/50 p-8 md:p-12 space-y-6">
          {state.data.services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between gap-4 group"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-[var(--brand-color)] transition-colors">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-sm text-zinc-500">{service.description}</p>
                )}
              </div>
              <div className="flex-1 border-b-2 border-dotted border-zinc-100 mx-2" />
              <div className="text-xl font-black text-zinc-900">
                {service.price}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SitePricing;
