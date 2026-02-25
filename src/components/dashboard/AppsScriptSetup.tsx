import React, { useState } from 'react';
import { useGoogle } from '../../context/GoogleContext';
import { useBuilder } from '../../context/BuilderContext';
import { getAppsScriptCode } from '../../lib/apps-script-template';
import { verifyConnection } from '../../lib/google';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  Shield,
  FileSpreadsheet,
  Globe,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';

interface AppsScriptSetupProps {
  onClose: () => void;
}

export const AppsScriptSetup: React.FC<AppsScriptSetupProps> = ({ onClose }) => {
  const { updateAppsScriptUrl } = useGoogle();
  const { businessData } = useBuilder();
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [url, setUrl] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scriptCode = getAppsScriptCode(businessData?.name || 'My Business');

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!url.startsWith('https://script.google.com/macros/s/') || !url.endsWith('/exec')) {
      setError('Invalid URL format. It should look like https://script.google.com/macros/s/.../exec');
      return;
    }

    setVerifying(true);
    setError(null);
    
    try {
      const result = await verifyConnection(url);
      if (result.connected) {
        updateAppsScriptUrl(url);
        onClose();
      } else {
        setError('Could not connect to your script. Make sure you deployed it as a "Web App" and set access to "Anyone".');
      }
    } catch (err) {
      setError('Something went wrong. Please check your URL and try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>

        <div className="p-8 md:p-12">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-purple-600' : 'bg-zinc-100'
                }`}
              />
            ))}
            <span className="ml-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Step {step} of 4
            </span>
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-zinc-900">Let's connect your Google account</h2>
                <p className="text-zinc-500 leading-relaxed">
                  We'll set up a free Google Sheet to automatically capture leads from your website contact form. 
                  All your data stays in YOUR Google account — we never store it.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center text-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                  <p className="text-sm font-bold text-emerald-900">Google Sheets</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center text-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <p className="text-sm font-bold text-blue-900">Secure & Private</p>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg"
              >
                Let's Do This <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-zinc-900">Create your Apps Script</h2>
                <p className="text-sm text-zinc-500">
                  Click the button below to open Google Apps Script in a new tab.
                </p>
              </div>

              <a 
                href="https://script.google.com/home/projects/create" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-colors"
              >
                Open Google Apps Script <ExternalLink className="ml-2 w-4 h-4" />
              </a>

              <div className="space-y-3">
                <p className="text-sm font-bold text-zinc-700">
                  Once it's open, delete any code you see and paste this:
                </p>
                <div className="relative group">
                  <pre className="bg-zinc-900 text-zinc-300 p-6 rounded-2xl text-xs font-mono overflow-x-auto max-h-48 scrollbar-hide">
                    {scriptCode}
                  </pre>
                  <button 
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={pasted}
                  onChange={(e) => setPasted(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-zinc-700">I've pasted the code</span>
              </label>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">
                  Back
                </Button>
                <Button 
                  disabled={!pasted}
                  onClick={() => setStep(3)}
                  className="flex-[2] h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-zinc-900">Deploy your script</h2>
                <p className="text-sm text-zinc-500">
                  Follow these steps in the Apps Script tab:
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Click Deploy (top right blue button)",
                  "Select New deployment",
                  "Click the gear icon ⚙️ and choose Web app",
                  "Set Execute as: 'Me'",
                  "Set Who has access: 'Anyone'",
                  "Click Deploy and Review Permissions",
                  "Choose your Google account and click Allow",
                  "Copy the Web app URL that appears"
                ].map((text, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="text-zinc-600">{text}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Important:</strong> Choose 'Anyone' for access. This lets your website visitors submit the contact form. Only YOU can see the data in your Google Sheet.
                </p>
              </div>

              <label className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={deployed}
                  onChange={(e) => setDeployed(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-zinc-700">I've deployed the script</span>
              </label>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl">
                  Back
                </Button>
                <Button 
                  disabled={!deployed}
                  onClick={() => setStep(4)}
                  className="flex-[2] h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-zinc-900">Paste your deployment URL</h2>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Web App URL
                  </label>
                  <input 
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/ABC123.../exec"
                    className="w-full h-14 px-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800 text-sm">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(3)} className="flex-1 h-14 rounded-2xl">
                  Back
                </Button>
                <Button 
                  disabled={!url || verifying}
                  onClick={handleVerify}
                  className="flex-[2] h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Connection'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
