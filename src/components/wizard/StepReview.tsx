import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Scissors, Sparkles, Utensils, Brain, ShoppingBag, Wrench, BookOpen, Church, LayoutGrid,
  MapPin, Phone, Mail, Loader2, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const iconMap: Record<string, any> = {
  barbershop: Scissors,
  salon: Sparkles,
  restaurant: Utensils,
  consultant: Brain,
  store: ShoppingBag,
  mechanic: Wrench,
  tutor: BookOpen,
  church: Church,
  other: LayoutGrid,
};

const StepReview: React.FC = () => {
  const { state, dispatch } = useBuilder();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildStep, setBuildStep] = useState(0);

  const buildMessages = [
    "Setting up your homepage...",
    "Adding your services...",
    "Applying your brand colors...",
    "Making it beautiful...",
    "Your site is ready! 🎉"
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    for (let i = 0; i < buildMessages.length; i++) {
      setBuildStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    navigate('/dashboard');
  };

  const BusinessIcon = iconMap[state.data.businessType] || LayoutGrid;

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {isGenerating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-12">
              <div className="relative w-32 h-32 mx-auto">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute inset-0 border-4 border-purple-100 border-t-purple-600 rounded-full shadow-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
                </div>
                
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [-20, -100],
                      x: [0, (i % 2 === 0 ? 40 : -40)],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.3,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full"
                  />
                ))}
              </div>

              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Crafting your site...</h2>
                  <p className="text-zinc-500 font-medium text-lg">{buildMessages[buildStep]}</p>
                </div>
                
                <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((buildStep + 1) / buildMessages.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Info */}
              <Card className="space-y-4 relative">
                <button 
                  onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}
                  className="absolute top-4 right-4 text-xs font-bold text-purple-600 hover:underline"
                >
                  Edit
                </button>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Your Business</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <BusinessIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{state.data.businessName || 'Unnamed Business'}</h4>
                    <p className="text-sm text-zinc-500">{state.data.businessType.charAt(0).toUpperCase() + state.data.businessType.slice(1)}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <MapPin className="w-4 h-4" /> {state.data.city}, {state.data.state}
                  </div>
                  {state.data.phone && (
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Phone className="w-4 h-4" /> {state.data.phone}
                    </div>
                  )}
                  {state.data.email && (
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Mail className="w-4 h-4" /> {state.data.email}
                    </div>
                  )}
                </div>
              </Card>

              {/* Design */}
              <Card className="space-y-4 relative">
                <button 
                  onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })}
                  className="absolute top-4 right-4 text-xs font-bold text-purple-600 hover:underline"
                >
                  Edit
                </button>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Design Style</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Selected Style</span>
                    <Badge variant="success" className="capitalize">{state.data.designStyle}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Brand Color</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">{state.data.brandColor}</span>
                      <div className="w-6 h-6 rounded-full border border-zinc-100" style={{ backgroundColor: state.data.brandColor }} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Services */}
              <Card className="space-y-4 relative md:col-span-2">
                <button 
                  onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
                  className="absolute top-4 right-4 text-xs font-bold text-purple-600 hover:underline"
                >
                  Edit
                </button>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Services ({state.data.services.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {state.data.services.slice(0, 4).map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg text-sm">
                      <span className="font-medium text-zinc-700">{s.name}</span>
                      <span className="text-zinc-400">{s.price}</span>
                    </div>
                  ))}
                  {state.data.services.length > 4 && (
                    <div className="p-2 text-xs text-zinc-400 italic">
                      + {state.data.services.length - 4} more services
                    </div>
                  )}
                </div>
              </Card>

              {/* Features */}
              <Card className="space-y-4 relative md:col-span-2">
                <button 
                  onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}
                  className="absolute top-4 right-4 text-xs font-bold text-purple-600 hover:underline"
                >
                  Edit
                </button>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Features Included</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(state.data.features).map(([key, enabled]) => (
                    enabled && (
                      <Badge key={key} className="bg-purple-50 text-purple-700 border border-purple-100 py-1 px-3">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Badge>
                    )
                  ))}
                </div>
              </Card>
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleGenerate}
                className="w-full py-8 text-xl rounded-2xl shadow-xl shadow-purple-100 group"
              >
                ✨ Build My Website
              </Button>
              <p className="text-center text-zinc-400 text-sm mt-4">
                By clicking build, we'll generate your professional site based on these details.
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StepReview;
