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
  LayoutDashboard,
  UserRound,
  Zap,
  TrendingUp,
  ShoppingCart,
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
  const [activePath, setActivePath] = useState<'scratch' | 'import'>('scratch');

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
              Your Business Deserves a Website. <br />
              <span className="text-purple-600">We Build It in Minutes.</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              my1stwebsite uses AI to create a professional website for your small business — no tech skills needed. Answer 6 simple questions and go live today.
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
                    Build My Website Free <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
                <div className="flex flex-col items-center gap-2">
                  <Link to="/builder?mode=import">
                    <button className="text-purple-600 font-semibold hover:underline text-base">
                      Have an existing website? We'll pull your info automatically →
                    </button>
                  </Link>
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

      {/* How it works — Two Paths */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-zinc-900 mb-4">How It Works</h2>
          <p className="text-center text-zinc-500 mb-12 max-w-2xl mx-auto">Two ways to get started — pick the one that fits you.</p>

          {/* Path Toggle */}
          <div className="flex justify-center gap-3 mb-12">
            <button
              onClick={() => setActivePath('scratch')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activePath === 'scratch'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300'
              }`}
            >
              Start From Scratch
            </button>
            <button
              onClick={() => setActivePath('import')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activePath === 'import'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300'
              }`}
            >
              AI Import (Existing Site)
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activePath === 'scratch' ? (
              <motion.div
                key="scratch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid md:grid-cols-3 gap-12"
              >
                {[
                  { title: "Tell us about your business", desc: "Answer 6 simple questions. No tech skills needed." },
                  { title: "AI builds your site", desc: "Our AI picks the right layout, colors, and content for your business type." },
                  { title: "Go live in minutes", desc: "Connect your domain and your site is live. Done." },
                ].map((step, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
                    <div className="w-12 h-12 bg-purple-100 text-[var(--brand-color)] rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                      {i + 1}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">{step.title}</h3>
                    <p className="text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="import"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid md:grid-cols-3 gap-12"
              >
                {[
                  { title: "Paste your current website URL", desc: "We scan your site and extract your business info automatically." },
                  { title: "Review what we found", desc: "See your business name, services, prices, and contact info — all pre-filled." },
                  { title: "Launch your new site", desc: "Your new site is ready. No retyping. No starting from scratch." },
                ].map((step, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
                    <div className="w-12 h-12 bg-purple-100 text-[var(--brand-color)] rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                      {i + 1}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">{step.title}</h3>
                    <p className="text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Why my1stwebsite — Comparison Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-6">
              Stop Paying Agency Prices for a Simple Website
            </h2>
            <p className="text-lg text-zinc-500 max-w-3xl mx-auto leading-relaxed">
              Traditional web design agencies charge $1,000–$1,500 or more for a basic one-page site — and it's outdated the moment it's delivered.
            </p>
            <p className="text-lg text-zinc-500 max-w-3xl mx-auto leading-relaxed mt-4">
              my1stwebsite gives you a full, multi-page website with a built-in business dashboard for as little as $15 a month. That's less than a tank of gas.
            </p>
            <p className="text-lg text-zinc-500 max-w-3xl mx-auto leading-relaxed mt-4">
              And if you already have a website? Paste the URL. We'll extract your business info automatically and rebuild it — better — in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <UserRound className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Built for Non-Techs</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">No coding. No design skills. Just answer questions and go.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Zap className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">AI Instant Import</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Already have a site? Paste your URL and skip the setup entirely.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Grows With You</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Start free. Upgrade when you're ready to go live or add ecommerce.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Features */}
      <section className="py-24 bg-zinc-50">
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
                <p className="text-xs font-bold text-zinc-900">"This works for businesses like yours."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commerce Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[32px] p-12 md:p-16 border border-purple-100">
            <ShoppingCart className="w-12 h-12 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">
              Ready to Sell Online? my1stwebsite Commerce Has You Covered.
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-4 leading-relaxed">
              Add products, accept payments, and manage your store — all from the same dashboard where you run your business.
            </p>
            <p className="text-purple-600 font-bold text-lg mb-8">
              Starting at $79/month. No transaction fees. No agency needed.
            </p>
            <Link to="/pricing">
              <Button size="lg" className="h-14 px-10 text-lg rounded-2xl shadow-xl shadow-purple-200">
                View Pricing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 text-center">
        <p className="text-zinc-400 text-sm">
          © 2026 my1stwebsite. Built for small businesses.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
