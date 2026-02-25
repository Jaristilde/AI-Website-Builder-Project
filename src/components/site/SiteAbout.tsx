import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { aboutText, galleryImages } from '../../lib/placeholders';
import { motion } from 'motion/react';

const SiteAbout: React.FC = () => {
  const { state } = useBuilder();
  const text = aboutText[state.data.businessType] || aboutText.other;
  const image = galleryImages[state.data.businessType]?.[0] || galleryImages.other[0];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-[var(--brand-color)]/10 rounded-[40px] -z-10" />
              <img
                src={image}
                alt="About Us"
                className="w-full aspect-[4/5] object-cover rounded-[32px] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <div className="space-y-4">
              <span className="text-sm font-bold text-[var(--brand-color)] uppercase tracking-widest">Our Story</span>
              <h2 className="text-4xl font-black text-zinc-900 leading-tight">
                About {state.data.businessName || 'Us'}
              </h2>
            </div>
            <p className="text-xl text-zinc-600 leading-relaxed">
              {text}
            </p>
            {state.data.ownerName && (
              <div className="pt-4">
                <p className="text-lg font-bold text-zinc-900">{state.data.ownerName}</p>
                <p className="text-zinc-500">Owner & Founder</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SiteAbout;
