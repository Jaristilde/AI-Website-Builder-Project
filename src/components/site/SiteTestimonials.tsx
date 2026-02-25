import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { testimonials } from '../../lib/placeholders';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

const SiteTestimonials: React.FC = () => {
  const { state } = useBuilder();
  if (!state.data.features.testimonials) return null;

  const typeTestimonials = testimonials[state.data.businessType] || testimonials.other;

  return (
    <section id="testimonials" className="py-24 bg-zinc-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-sm font-bold text-[var(--brand-color)] uppercase tracking-widest">Testimonials</span>
          <h2 className="text-4xl font-black">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {typeTestimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-800/50 p-8 rounded-[32px] border border-zinc-700 relative"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-zinc-700" />
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[var(--brand-color)] text-[var(--brand-color)]" />
                ))}
              </div>
              <p className="text-lg text-zinc-300 leading-relaxed mb-8 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center font-bold text-zinc-400">
                  {t.name.charAt(0)}
                </div>
                <span className="font-bold text-zinc-100">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SiteTestimonials;
