import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useBuilder } from '../context/BuilderContext';
import { BusinessData, DesignStyle } from '../types/builder';

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

interface PublishedSitePageProps {
  slug?: string;
}

const styleClasses: Record<string, string> = {
  modern: 'font-sans text-zinc-800',
  luxury: 'font-serif text-zinc-900 tracking-wide',
  minimal: 'font-sans text-zinc-700 tracking-tight',
  bold: 'font-sans text-zinc-900 font-bold',
  dark: 'font-sans text-zinc-100 bg-zinc-900',
  warm: 'font-serif text-amber-900',
};

const PublishedSitePage: React.FC<PublishedSitePageProps> = ({ slug: slugProp }) => {
  const params = useParams<{ slug: string }>();
  const slug = slugProp || params.slug;
  const { dispatch } = useBuilder();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designStyle, setDesignStyle] = useState<DesignStyle>('modern');

  useEffect(() => {
    if (!slug) {
      setError('No site specified');
      setLoading(false);
      return;
    }

    async function fetchSite() {
      try {
        const sitesRef = collection(db, 'published_sites');
        const q = query(sitesRef, where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError('Site not found');
          setLoading(false);
          return;
        }

        const doc = snapshot.docs[0];
        const businessData = doc.data().businessData as BusinessData;

        // Inject into BuilderContext
        dispatch({ type: 'LOAD_PUBLISHED_SITE', payload: businessData });

        // Set brand color CSS variable
        document.documentElement.style.setProperty('--brand-color', businessData.brandColor);

        // Update page title
        document.title = businessData.businessName || 'Published Site';

        setDesignStyle(businessData.designStyle);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching published site:', err);
        setError('Failed to load site');
        setLoading(false);
      }
    }

    fetchSite();
  }, [slug, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 font-medium">Loading site...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🌐</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900">Site Not Found</h1>
          <p className="text-zinc-500 text-lg">
            The website you're looking for doesn't exist or may have been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-colors"
          >
            Build Your Own Website — Free
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styleClasses[designStyle] || styleClasses.modern}>
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
  );
};

export default PublishedSitePage;
