import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Button } from '../ui/button';
import { heroImages } from '../../lib/placeholders';
import { businessTemplates } from '../../lib/templates';
import { motion } from 'motion/react';

const SiteHero: React.FC = () => {
  const { state } = useBuilder();
  const template = businessTemplates[state.data.businessType];
  const heroImage = heroImages[state.data.businessType] || heroImages.other;

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            {state.data.businessName || 'Welcome to Our Business'}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-200 font-medium max-w-2xl mx-auto mt-6">
            {state.data.tagline || 'We provide high-quality services tailored to your needs.'}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-xl rounded-2xl w-full sm:w-auto">
              {template?.ctaText || 'Get Started'}
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 text-xl rounded-2xl w-full sm:w-auto border-white text-white hover:bg-white hover:text-zinc-900">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SiteHero;
