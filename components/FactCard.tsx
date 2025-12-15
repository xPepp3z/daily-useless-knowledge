import React, { useState, useEffect } from 'react';
import { UselessFact } from '../types';

interface FactCardProps {
  fact: UselessFact | null;
  loading: boolean;
  error: string | null;
}

const FactCard: React.FC<FactCardProps> = ({ fact, loading, error }) => {
  const [copied, setCopied] = useState(false);

  // Reset copied state when a new fact is loaded
  useEffect(() => {
    setCopied(false);
  }, [fact]);

  const handleCopy = async () => {
    if (!fact?.text) return;
    try {
      await navigator.clipboard.writeText(fact.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (!fact?.text) return;
    
    // Determine the URL to share. Use permalink if available, otherwise current page.
    let shareUrl = fact.permalink || window.location.href;

    // Validate URL to prevent "Invalid URL" errors in navigator.share
    try {
      new URL(shareUrl);
    } catch (e) {
      // Fallback if URL is invalid (e.g. in some iframe environments)
      shareUrl = 'https://uselessfacts.jsph.pl';
    }
    
    const shareData = {
      title: 'Daily Useless Knowledge',
      text: fact.text,
      url: shareUrl,
    };

    const openTwitterFallback = () => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fact.text)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignore AbortError (user cancelled)
        if (err instanceof Error && err.name !== 'AbortError') {
          console.warn('Native share failed, falling back to Twitter:', err);
          openTwitterFallback();
        }
      }
    } else {
      openTwitterFallback();
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center shadow-sm transition-colors duration-300">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-800 mb-4">
          <svg className="h-6 w-6 text-red-600 dark:text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-900 dark:text-red-200">Error</h3>
        <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className={`
      relative w-full max-w-2xl 
      transition-all duration-500 ease-out
      ${loading ? 'scale-[0.98] opacity-80 blur-[2px]' : 'scale-100 opacity-100'}
    `}>
      {/* Abstract background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-xl dark:opacity-30"></div>
      
      <div className={`
        relative flex flex-col justify-center min-h-[300px]
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
        rounded-2xl border border-white/20 dark:border-slate-700/50
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
        p-8 md:p-12
      `}>
        
        {fact ? (
          <>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleShare}
                disabled={loading}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Share fact"
                title="Share fact"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              <button
                onClick={handleCopy}
                disabled={loading}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Copy to clipboard"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex flex-col h-full justify-between animate-in fade-in duration-700">
              <div className="flex-grow flex items-center justify-center">
                <p className="text-2xl md:text-4xl font-bold leading-snug text-slate-800 dark:text-slate-100 tracking-tight text-center">
                  {fact.text}
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                {fact.source !== 'djtech.net' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                     SOURCE: {fact.source}
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
             <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce mr-1"></div>
             <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce mr-1 delay-75"></div>
             <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactCard;