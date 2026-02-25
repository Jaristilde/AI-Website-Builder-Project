import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { motion } from 'motion/react';

const SiteMenu: React.FC = () => {
  const { state } = useBuilder();
  if (state.data.businessType !== 'restaurant' || !state.data.features.menu) return null;

  // Group services by category
  const categories = Array.from(new Set(state.data.services.map(s => s.category || 'Main Menu')));

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="text-sm font-bold text-[var(--brand-color)] uppercase tracking-widest">Our Menu</span>
          <h2 className="text-5xl font-black text-zinc-900">Taste the Tradition</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {categories.map((category, i) => (
            <div key={category} className="space-y-8">
              <h3 className="text-2xl font-black text-zinc-900 border-b-4 border-[var(--brand-color)] inline-block pb-2">
                {category}
              </h3>
              <div className="space-y-8">
                {state.data.services
                  .filter(s => (s.category || 'Main Menu') === category)
                  .map((item, j) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.1 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between items-baseline gap-4">
                        <h4 className="text-lg font-bold text-zinc-900">{item.name}</h4>
                        <span className="font-black text-zinc-900">{item.price}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-zinc-500 leading-relaxed italic">
                          {item.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SiteMenu;
