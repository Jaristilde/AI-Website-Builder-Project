import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useBuilder } from '../context/BuilderContext';
import { Header } from '../components/Header';
import { 
  Scissors, 
  Sparkles, 
  Utensils, 
  Brain, 
  ShoppingBag, 
  Wrench, 
  BookOpen, 
  Church, 
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const icons = [Scissors, Sparkles, Utensils, Brain, ShoppingBag, Wrench, BookOpen, Church, LayoutGrid];

const previewImages = [
  { name: "Real Estate", src: "/previews/real-estate.png" },
  { name: "Barbershop", src: "/previews/barbershop.png" },
  { name: "Fitness", src: "/previews/fitness.png" },
  { name: "Makeup", src: "/previews/makeup.png" },
  { name: "Restaurant", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" },
];

const LandingPage: React.FC = () => {
  const { businessData } = useBuilder();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % previewImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-black text-zinc-900 tracking-tight mb-8">
              If You Can Answer Questions, <br />
              <span className="text-purple-600">You Can Build Your Website.</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Built for everyday business owners. Answer a few simple questions and launch a professional website in minutes — no tech skills needed.
            </p>
            {businessData ? (
              <div className="space-y-6">
                <p className="text-zinc-500 font-medium">Welcome back, {businessData.name}!</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/preview">
                    <Button size="lg" className="h-16 px-10 text-xl rounded-2xl shadow-xl shadow-purple-200">
                      View My Website <Globe className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="lg" variant="outline" className="h-16 px-10 text-xl rounded-2xl">
                      Dashboard <LayoutDashboard className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Link to="/builder">
                  <Button size="lg" className="h-16 px-10 text-xl rounded-2xl shadow-xl shadow-purple-200">
                    Build My Website <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
                <div className="flex flex-col items-center gap-2">
                  <Link to="/builder?mode=import">
                    <Button variant="outline" size="lg" className="rounded-2xl">
                      Import from Existing Website <Globe className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <p className="text-sm text-zinc-400">Have an existing website? We'll extract your info automatically.</p>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 grid grid-cols-3 md:grid-cols-9 gap-6 max-w-4xl mx-auto opacity-40"
          >
            {icons.map((Icon, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Icon className="w-8 h-8" />
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* How it works */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-zinc-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Pick your business type", desc: "We've pre-built templates for barbers, restaurants, consultants, and more." },
              { title: "Customize your services", desc: "Edit your price list and features with our simple wizard." },
              { title: "Get your professional website", desc: "Your site is ready to launch with booking, maps, and more." }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
                <div className="w-12 h-12 bg-purple-100 text-[var(--brand-color)] rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-bold text-zinc-900 leading-tight">
              Everything your business needs <br /> to look professional online.
            </h2>
            <ul className="space-y-4">
              {[
                "Let customers book you online",
                "Looks perfect on phones and tablets",
                "Show your location on Google Maps",
                "Connect your Instagram & social media",
                "Display real customer reviews",
                "Match your brand colors instantly"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                  <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full max-w-xl">
            <div className="carousel-container" style={{
              width: "100%",
              aspectRatio: "4/5",
              overflow: "hidden",
              borderRadius: "24px",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              backgroundColor: "#f4f4f5"
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute"
                  }}
                >
                  <img
                    src={previewImages[currentImage].src}
                    alt={previewImages[currentImage].name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (previewImages[currentImage].name === "Real Estate") {
                        target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";
                      } else if (previewImages[currentImage].name === "Barbershop") {
                        target.src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80";
                      } else if (previewImages[currentImage].name === "Fitness") {
                        target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80";
                      } else if (previewImages[currentImage].name === "Makeup") {
                        target.src = "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white z-10">
                    <p className="text-sm font-bold uppercase tracking-widest mb-1 opacity-80 drop-shadow-md">Example Preview</p>
                    <h3 className="text-3xl font-black drop-shadow-md">{previewImages[currentImage].name} Website</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm z-20">
                <p className="text-xs font-bold text-zinc-900">“This works for businesses like yours.”</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 text-center">
        <p className="text-zinc-400 text-sm">
          © 2026 AI Website Builder. Built for small businesses.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
