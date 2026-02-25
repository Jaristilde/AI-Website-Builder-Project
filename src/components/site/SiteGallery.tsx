import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { galleryImages } from '../../lib/placeholders';
import { motion } from 'motion/react';

const SiteGallery: React.FC = () => {
  const { state } = useBuilder();
  if (!state.data.features.gallery) return null;

  const images = galleryImages[state.data.businessType] || galleryImages.other;

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-sm font-bold text-[var(--brand-color)] uppercase tracking-widest">Gallery</span>
          <h2 className="text-4xl font-black text-zinc-900">Our Work</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-3xl"
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SiteGallery;
