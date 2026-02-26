import React, { useState, useEffect } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { Button } from '../components/ui/button';
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  LayoutDashboard,
  ExternalLink,
  Edit3,
  Rocket,
  Globe,
} from 'lucide-react';
import { PublishState } from '../types/builder';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

// Site Sections
import SiteNavbar from '../components/site/SiteNavbar';
import SiteHero from '../components/site/SiteHero';
import SiteAbout from '../components/site/SiteAbout';
import SiteServices from '../components/site/SiteServices';
import SiteGallery from '../components/site/SiteGallery';
import SitePricing from '../components/site/SitePricing';
import SiteMenu from '../components/site/SiteMenu';
import SiteTestimonials from '../components/site/SiteTestimonials';
import SiteBooking from '../components/site/SiteBooking';
import SiteContact from '../components/site/SiteContact';
import SiteFooter from '../components/site/SiteFooter';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const PreviewPage: React.FC = () => {
  const { state, dispatch, businessData } = useBuilder();
  const [device, setDevice] = useState<DeviceType>('desktop');
  const navigate = useNavigate();

  useEffect(() => {
    if (!businessData) {
      navigate('/builder');
    }
  }, [businessData, navigate]);

  if (!businessData) return null;

  const handleEdit = () => {
    dispatch({ type: 'SET_STEP', payload: 6 });
    navigate('/builder');
  };

  const styleClasses = {
    modern: 'font-sans text-zinc-800',
    luxury: 'font-serif text-zinc-900 tracking-wide',
    minimal: 'font-sans text-zinc-700 tracking-tight',
    bold: 'font-sans text-zinc-900 font-bold',
    dark: 'font-sans text-zinc-100 bg-zinc-900',
    warm: 'font-serif text-amber-900',
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Preview Chrome / Toolbar */}
      <div className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-6 sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleEdit} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Edit
          </Button>
          <div className="h-6 w-[1px] bg-zinc-200 mx-2" />
          <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Preview Mode</span>
        </div>

        {/* Device Switcher */}
        <div className="hidden md:flex items-center bg-zinc-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setDevice('desktop')}
            className={cn(
              'p-2 rounded-lg transition-all',
              device === 'desktop' ? 'bg-white shadow-sm text-[var(--brand-color)]' : 'text-zinc-400 hover:text-zinc-600'
            )}
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={cn(
              'p-2 rounded-lg transition-all',
              device === 'tablet' ? 'bg-white shadow-sm text-[var(--brand-color)]' : 'text-zinc-400 hover:text-zinc-600'
            )}
          >
            <Tablet className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={cn(
              'p-2 rounded-lg transition-all',
              device === 'mobile' ? 'bg-white shadow-sm text-[var(--brand-color)]' : 'text-zinc-400 hover:text-zinc-600'
            )}
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {(() => {
            try {
              const saved = localStorage.getItem('publish_state');
              const ps: PublishState | null = saved ? JSON.parse(saved) : null;
              if (ps?.isPublished && ps.url) {
                return (
                  <a href={ps.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Globe className="w-4 h-4" /> View Live
                    </Button>
                  </a>
                );
              }
            } catch {}
            return null;
          })()}
          <Button
            size="sm"
            onClick={() => navigate('/dashboard?tab=publish')}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Rocket className="w-4 h-4" /> Publish
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
        </div>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
        <motion.div
          layout
          initial={false}
          animate={{
            width: device === 'desktop' ? '100%' : device === 'tablet' ? '768px' : '375px',
            borderRadius: device === 'desktop' ? '0px' : device === 'tablet' ? '40px' : '60px',
            borderWidth: device === 'desktop' ? '0px' : '12px',
            height: device === 'desktop' ? '100%' : device === 'tablet' ? '1024px' : '812px',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'bg-white shadow-2xl overflow-auto relative border-zinc-900',
          )}
        >
          {/* The Generated Site */}
          <div className={cn('w-full h-full', styleClasses[state.data.designStyle])}>
            <SiteNavbar />
            <SiteHero />
            <SiteAbout />
            <SiteServices />
            <SiteGallery />
            <SitePricing />
            <SiteMenu />
            <SiteTestimonials />
            <SiteBooking />
            <SiteContact />
            <SiteFooter />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PreviewPage;
