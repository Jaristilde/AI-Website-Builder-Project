import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StepBusinessType from './StepBusinessType';
import StepServices from './StepServices';
import StepFeatures from './StepFeatures';
import StepBusinessInfo from './StepBusinessInfo';
import StepDesignStyle from './StepDesignStyle';
import StepReview from './StepReview';
import { Header } from '../Header';

const stepTitles: Record<number, string> = {
  1: "What type of business are you?",
  2: "What services do you offer?",
  3: "What features do you need?",
  4: "Tell us about your business",
  5: "Choose your style",
  6: "Review & build!",
};

interface WizardShellProps {
  autoShowImport?: boolean;
}

const WizardShell: React.FC<WizardShellProps> = ({ autoShowImport = false }) => {
  const { state, dispatch } = useBuilder();
  const { step } = state;
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back

  const handleNext = () => {
    if (step < 6) {
      setDirection(1);
      dispatch({ type: 'SET_STEP', payload: (step + 1) as any });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      dispatch({ type: 'SET_STEP', payload: (step - 1) as any });
    }
  };

  const isStepValid = () => {
    const { data } = state;
    switch (step) {
      case 1: 
        if (!data.businessType) return false;
        if (data.businessType === 'other' && !data.customType?.trim()) return false;
        return true;
      case 2: return data.services.length > 0;
      case 4: return !!data.businessName.trim() && !!data.city.trim() && !!data.state;
      case 5: return !!data.brandColor && /^#[0-9A-F]{6}$/i.test(data.brandColor);
      default: return true;
    }
  };

  const progress = (step / 6) * 100;

  const renderStep = () => {
    switch (step) {
      case 1: return <StepBusinessType autoShowImport={autoShowImport} />;
      case 2: return <StepServices />;
      case 3: return <StepFeatures />;
      case 4: return <StepBusinessInfo />;
      case 5: return <StepDesignStyle />;
      case 6: return <StepReview />;
      default: return <div className="p-10 text-center text-zinc-400">Step {step} coming soon</div>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />
      {/* Header / Progress */}
      <div className="bg-white border-b border-zinc-100 sticky top-20 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Step {step} of 6
            </span>
            <h1 className="text-xl font-bold text-zinc-900">{stepTitles[step]}</h1>
          </div>
          <Progress value={progress} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-zinc-100 p-6 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={step === 6 || !isStepValid()}
            className="flex items-center gap-2 min-w-[140px] rounded-xl h-12 shadow-lg shadow-purple-100 transition-all active:scale-95"
          >
            {step === 6 ? 'Build Website' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WizardShell;
