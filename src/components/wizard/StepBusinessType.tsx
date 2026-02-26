import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { BusinessType, BusinessData } from '../../types/builder';
import { scrapeUrl } from '../../lib/scraper';
import { extractBusinessData } from '../../lib/ai-extract';
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
  Globe,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Tag,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const businessTypes: { type: BusinessType; label: string; icon: any }[] = [
  { type: 'barbershop', label: 'Barbershop', icon: Scissors },
  { type: 'salon', label: 'Salon / Beauty', icon: Sparkles },
  { type: 'restaurant', label: 'Restaurant / Food', icon: Utensils },
  { type: 'consultant', label: 'Consultant / Coach', icon: Brain },
  { type: 'store', label: 'Online Store', icon: ShoppingBag },
  { type: 'mechanic', label: 'Mechanic / Auto', icon: Wrench },
  { type: 'tutor', label: 'Tutor / Educator', icon: BookOpen },
  { type: 'church', label: 'Church / Ministry', icon: Church },
  { type: 'other', label: 'Other', icon: LayoutGrid },
];

const URL_REGEX = /^https?:\/\/.+\..+/;
const LOOSE_URL_REGEX = /^(https?:\/\/)?.+\..+/;

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return 'https://' + trimmed;
  }
  return trimmed;
}

interface StepBusinessTypeProps {
  autoShowImport?: boolean;
}

const StepBusinessType: React.FC<StepBusinessTypeProps> = ({ autoShowImport = false }) => {
  const { state, dispatch } = useBuilder();
  const [customType, setCustomType] = useState(state.data.customType || '');
  const [showImport, setShowImport] = useState(autoShowImport);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Partial<BusinessData> | null>(null);

  const loadingMessages = [
    'Scanning website...',
    'Extracting business info...',
    'Almost done...',
  ];

  const handleSelect = (type: BusinessType) => {
    if (showImport) {
      setShowImport(false);
      setUrl('');
      setError('');
      setResult(null);
    }
    dispatch({ type: 'SET_BUSINESS_TYPE', payload: { type, customType: type === 'other' ? customType : undefined } });
    if (type !== 'other') {
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  const handleImportClick = () => {
    setShowImport(!showImport);
    setError('');
    setResult(null);
    if (!showImport) {
      // Deselect any current business type selection visually
      // (we don't dispatch to avoid losing template data until import succeeds)
    }
  };

  const handleAnalyze = async () => {
    const normalizedUrl = normalizeUrl(url);
    if (!URL_REGEX.test(normalizedUrl)) {
      setError('Please enter a valid URL (e.g. yourbusiness.com)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setLoadingPhase(0);

    try {
      // Phase 1: Scrape
      const scrapeResult = await scrapeUrl(normalizedUrl);
      if (!scrapeResult.success || !scrapeResult.markdown) {
        setError(scrapeResult.error || 'Could not read that website. Please check the URL and try again.');
        setLoading(false);
        return;
      }

      // Phase 2: Extract
      setLoadingPhase(1);
      const extraction = await extractBusinessData(scrapeResult.markdown, scrapeResult.metadata);
      if (!extraction.success || !extraction.data) {
        setError(extraction.message || 'Could not extract business data. Please try again.');
        setLoading(false);
        return;
      }

      // Phase 3: Finishing
      setLoadingPhase(2);
      await new Promise((r) => setTimeout(r, 800));

      setResult(extraction.data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseData = () => {
    if (result) {
      dispatch({ type: 'IMPORT_FROM_URL', payload: result });
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  const handleReset = () => {
    setUrl('');
    setError('');
    setResult(null);
    setLoading(false);
    setLoadingPhase(0);
  };

  const progressValue = loading
    ? Math.min(((loadingPhase + 1) / loadingMessages.length) * 100, 95)
    : result
      ? 100
      : 0;

  const isValidUrl = LOOSE_URL_REGEX.test(url.trim());

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {businessTypes.map(({ type, label, icon: Icon }) => (
          <motion.div
            key={type}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            <Card
              selected={!showImport && state.data.businessType === type}
              onClick={() => handleSelect(type)}
              className="h-full flex flex-col items-center justify-center text-center gap-4 py-8 transition-shadow hover:shadow-lg"
            >
              <div className={!showImport && state.data.businessType === type ? 'text-[var(--brand-color)]' : 'text-zinc-400'}>
                <Icon className="w-10 h-10" />
              </div>
              <span className="font-bold text-zinc-900">{label}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      {!showImport && state.data.businessType === 'other' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border-2 border-zinc-100 space-y-4"
        >
          <Input
            label="What kind of business?"
            placeholder="e.g. Pet Grooming, Yoga Studio..."
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end">
             <button
               onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
               disabled={!customType.trim()}
               className="text-[var(--brand-color)] font-bold hover:underline disabled:opacity-50"
             >
               Next Step →
             </button>
          </div>
        </motion.div>
      )}

      {/* Import from Website Card */}
      <motion.div
        whileHover={!showImport ? { y: -2, scale: 1.005 } : undefined}
        whileTap={!showImport ? { scale: 0.99 } : undefined}
      >
        <div
          onClick={!showImport && !loading ? handleImportClick : undefined}
          className={`
            w-full rounded-2xl border-2 border-dashed p-6 text-center transition-all
            ${showImport
              ? 'border-[var(--brand-color)] bg-purple-50/50'
              : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md cursor-pointer'
            }
          `}
        >
          {!showImport && (
            <div className="flex items-center justify-center gap-3">
              <Globe className="w-6 h-6 text-[var(--brand-color)]" />
              <span className="font-bold text-zinc-900">Import from Website</span>
              <span className="text-sm text-zinc-400">— have an existing site? We'll grab your info</span>
            </div>
          )}

          {showImport && (
            <div onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[var(--brand-color)]" />
                  <span className="font-bold text-zinc-900">Import from Website</span>
                </div>
                <button
                  onClick={() => { setShowImport(false); handleReset(); }}
                  className="text-sm text-zinc-400 hover:text-zinc-600"
                >
                  Cancel
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* URL Input State */}
                {!loading && !result && !error && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Website URL"
                      placeholder="https://yourbusiness.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      autoFocus
                    />
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                      <p className="text-xs font-semibold text-amber-700 mb-1">Content & Inspiration Notice</p>
                      <p className="text-xs text-amber-600 leading-relaxed">
                        You may paste websites for inspiration only. Don't copy other sites' exact text, images, or unique designs. Always customize generated content to be original and reflect your own business.
                      </p>
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!isValidUrl}
                      className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-purple-100"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Analyze Website
                    </Button>
                  </motion.div>
                )}

                {/* Error + URL Input State */}
                {!loading && !result && error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-left">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                    <Input
                      label="Website URL"
                      placeholder="https://yourbusiness.com"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(''); }}
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAnalyze}
                        disabled={!isValidUrl}
                        className="flex-1 h-12 rounded-xl text-base font-semibold"
                      >
                        Try Again
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Loading State */}
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 py-4"
                  >
                    <div className="flex flex-col items-center gap-4">
                      {/* Spinner */}
                      <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                      <p className="text-sm font-semibold text-zinc-700">
                        {loadingMessages[loadingPhase]}
                      </p>
                    </div>
                    <Progress value={progressValue} />
                    <p className="text-xs text-zinc-400 text-center">
                      Analyzing {normalizeUrl(url)}
                    </p>
                  </motion.div>
                )}

                {/* Success State */}
                {!loading && result && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 text-emerald-600 justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold text-sm">Website analyzed successfully</span>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white border border-zinc-200 rounded-xl p-5 text-left space-y-3">
                      {result.businessName && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-zinc-400 shrink-0" />
                          <div>
                            <p className="text-xs text-zinc-400 uppercase tracking-wider">Business Name</p>
                            <p className="font-bold text-zinc-900">{result.businessName}</p>
                          </div>
                        </div>
                      )}
                      {result.businessType && (
                        <div className="flex items-center gap-3">
                          <Tag className="w-4 h-4 text-zinc-400 shrink-0" />
                          <div>
                            <p className="text-xs text-zinc-400 uppercase tracking-wider">Business Type</p>
                            <p className="font-bold text-zinc-900 capitalize">{result.businessType}</p>
                          </div>
                        </div>
                      )}
                      {result.services && result.services.length > 0 && (
                        <div className="flex items-center gap-3">
                          <LayoutGrid className="w-4 h-4 text-zinc-400 shrink-0" />
                          <div>
                            <p className="text-xs text-zinc-400 uppercase tracking-wider">Services Found</p>
                            <p className="font-bold text-zinc-900">{result.services.length} service{result.services.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleUseData}
                        className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-purple-100"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Use This Data
                      </Button>
                      <button
                        onClick={handleReset}
                        className="flex items-center justify-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 py-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StepBusinessType;
