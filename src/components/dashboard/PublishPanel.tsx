import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { publishSite, checkSlugAvailability } from '../../lib/publish';
import { generateSlug, isValidSlug } from '../../lib/subdomain';
import { PublishState } from '../../types/builder';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Globe,
  Check,
  X,
  Loader2,
  Copy,
  ExternalLink,
  RefreshCw,
  Rocket,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PUBLISH_STATE_KEY = 'publish_state';

function loadPublishState(): PublishState {
  try {
    const saved = localStorage.getItem(PUBLISH_STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { isPublished: false, slug: null, publishToken: null, url: null };
}

function savePublishState(state: PublishState) {
  localStorage.setItem(PUBLISH_STATE_KEY, JSON.stringify(state));
}

export const PublishPanel: React.FC = () => {
  const { state } = useBuilder();
  const businessData = state.data;

  const [publishState, setPublishState] = useState<PublishState>(loadPublishState);
  const [slug, setSlug] = useState(() => {
    const saved = loadPublishState();
    return saved.slug || generateSlug(businessData.businessName || '');
  });
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [justPublished, setJustPublished] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseUrl = window.location.origin;

  // Debounced slug availability check
  const checkAvailability = useCallback((slugToCheck: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!slugToCheck || !isValidSlug(slugToCheck)) {
      setSlugAvailable(null);
      return;
    }

    // If this is the already-published slug, it's "available" (it's ours)
    if (publishState.isPublished && slugToCheck === publishState.slug) {
      setSlugAvailable(true);
      return;
    }

    setCheckingSlug(true);
    debounceRef.current = setTimeout(async () => {
      const result = await checkSlugAvailability(slugToCheck);
      setSlugAvailable(result.available);
      setCheckingSlug(false);
    }, 500);
  }, [publishState.isPublished, publishState.slug]);

  useEffect(() => {
    checkAvailability(slug);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [slug, checkAvailability]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(raw);
    setPublishError(null);
  };

  const handlePublish = async () => {
    if (!slug || !isValidSlug(slug)) return;

    setPublishing(true);
    setPublishError(null);

    const result = await publishSite(
      businessData,
      slug,
      publishState.publishToken || undefined
    );

    if (result.success) {
      const newState: PublishState = {
        isPublished: true,
        slug: result.slug!,
        publishToken: result.publishToken!,
        url: result.url!,
      };
      setPublishState(newState);
      savePublishState(newState);
      setJustPublished(true);
      setTimeout(() => setJustPublished(false), 3000);
    } else {
      setPublishError(result.error || 'Publishing failed. Please try again.');
    }

    setPublishing(false);
  };

  const handleCopyUrl = () => {
    const url = publishState.url || `${baseUrl}/site/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const liveUrl = publishState.url || `${baseUrl}/site/${slug}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-zinc-900">Publish Your Website</h2>
        <p className="text-zinc-500 mt-1">
          Make your website live and share it with the world.
        </p>
      </div>

      {/* Published Status Banner */}
      <AnimatePresence>
        {publishState.isPublished && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Your site is live!</p>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 font-medium hover:underline break-all"
                  >
                    {liveUrl}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="gap-2 text-emerald-700 hover:bg-emerald-100"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-2 text-emerald-700 hover:bg-emerald-100">
                    <ExternalLink className="w-4 h-4" /> Visit
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slug Configuration */}
      <div className="bg-white border border-zinc-100 rounded-3xl p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-zinc-900">Your Website URL</h3>
          <p className="text-sm text-zinc-500">
            Choose a unique URL for your website. This is how customers will find you.
          </p>
        </div>

        {/* Slug Input with Live Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={slug}
                onChange={handleSlugChange}
                placeholder="your-business-name"
                className="pr-10 font-mono"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingSlug && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />}
                {!checkingSlug && slugAvailable === true && (
                  <Check className="w-4 h-4 text-emerald-500" />
                )}
                {!checkingSlug && slugAvailable === false && (
                  <X className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* URL Preview */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 rounded-2xl">
            <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-sm text-zinc-500 font-mono truncate">
              {baseUrl}/site/<span className="text-[var(--brand-color)] font-bold">{slug || '...'}</span>
            </span>
          </div>

          {/* Validation Feedback */}
          {slug && !isValidSlug(slug) && (
            <p className="text-sm text-red-500">
              Use lowercase letters, numbers, and hyphens only (3-50 characters).
            </p>
          )}
          {!checkingSlug && slugAvailable === false && isValidSlug(slug) && (
            <p className="text-sm text-red-500">
              This URL is already taken. Try a different one.
            </p>
          )}
        </div>
      </div>

      {/* Publish / Update Button */}
      <div className="space-y-4">
        {publishError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-700 font-medium">{publishError}</p>
          </div>
        )}

        <Button
          onClick={handlePublish}
          disabled={publishing || !slug || !isValidSlug(slug) || slugAvailable === false || checkingSlug}
          className="w-full py-4 text-lg rounded-2xl gap-3 bg-[var(--brand-color)] hover:opacity-90"
        >
          {publishing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {publishState.isPublished ? 'Updating...' : 'Publishing...'}
            </>
          ) : justPublished ? (
            <>
              <Check className="w-5 h-5" />
              Published!
            </>
          ) : publishState.isPublished ? (
            <>
              <RefreshCw className="w-5 h-5" />
              Update Published Site
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Publish Website
            </>
          )}
        </Button>

        {publishState.isPublished && (
          <p className="text-center text-sm text-zinc-400">
            Made changes in the builder? Click update to push them live.
          </p>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-purple-50 border border-purple-100 rounded-3xl p-6 space-y-3">
        <h4 className="font-bold text-purple-900">How Publishing Works</h4>
        <ul className="space-y-2 text-sm text-purple-700">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 shrink-0" />
            Your site goes live instantly at the URL above
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 shrink-0" />
            Share the link with customers, on social media, or anywhere
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 shrink-0" />
            Edit your site anytime and click "Update" to push changes live
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 shrink-0" />
            Custom domains coming soon — upgrade to connect your own URL
          </li>
        </ul>
      </div>
    </div>
  );
};
