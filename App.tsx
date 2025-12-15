import React, { useState, useEffect, useCallback } from 'react';
import { fetchRandomFact } from './services/api';
import { UselessFact, Language } from './types';
import FactCard from './components/FactCard';
import Button from './components/Button';

const App: React.FC = () => {
  // History State
  const [history, setHistory] = useState<UselessFact[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Settings State
  const [language, setLanguage] = useState<Language>('en');

  // Function to load a fact
  const loadFact = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRandomFact(language);
      
      setHistory(prev => {
        const newHistory = [...prev, data];
        return newHistory;
      });
      
      // Move index to the new last item
      setCurrentIndex(prev => prev + 1);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load fact. Please check your internet connection.');
      }
    } finally {
      // Keep loading state at least for a bit to prevent UI flicker
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [language]);

  // Handle Language Change
  // When language changes, we clear history so the user doesn't see facts in the wrong language when navigating back.
  const handleLanguageChange = (newLang: Language) => {
    if (newLang === language) return;
    
    setLoading(true); // Show loading immediately
    setLanguage(newLang);
    setHistory([]); // Clear history
    setCurrentIndex(-1); // Reset index
    // The useEffect below will detect history.length === 0 and trigger loadFact automatically
  };

  // Initial load and reload on history clear
  useEffect(() => {
    // Only load if history is empty. This happens on first load AND when we clear history on language switch.
    if (history.length === 0) {
      loadFact();
    }
  }, [loadFact, history.length]);

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentFact = history[currentIndex] || null;
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  return (
    <div className="min-h-screen relative flex flex-col transition-colors duration-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none transition-opacity duration-300" 
        style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
        }}
      ></div>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 z-10 relative">
        
        {/* Language Toggle */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full p-1 shadow-sm border border-slate-200 dark:border-slate-700 flex">
            <button 
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                language === 'en' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300'
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => handleLanguageChange('it')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                language === 'it' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300'
              }`}
            >
              IT
            </button>
          </div>
        </div>

        <header className="mb-12 text-center mt-12 md:mt-0 max-w-xl mx-auto">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/50 rounded-full border border-indigo-100 dark:border-indigo-900 transition-colors duration-300">
            {language === 'en' ? 'Daily Knowledge' : 'Curiosità Quotidiane'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4 transition-colors duration-300 leading-tight">
            Useless Facts
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium transition-colors duration-300">
            {language === 'en' 
              ? 'Facts you will likely never need, delivered daily.'
              : 'Fatti di cui probabilmente non avrai mai bisogno, ogni giorno.'}
          </p>
        </header>

        <section className="w-full flex justify-center mb-12 px-4">
          <FactCard fact={currentFact} loading={loading && !currentFact} error={error} />
        </section>

        <section className="flex flex-col items-center space-y-4">
           <div className="flex items-center gap-3">
             {/* Previous Button */}
             <button
               onClick={handlePrevious}
               disabled={!canGoBack || loading}
               className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
               aria-label="Previous fact"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
             </button>

             {/* New Fact Button */}
             <Button 
               onClick={loadFact} 
               isLoading={loading}
               loadingText={language === 'it' ? 'Caricamento...' : 'Loading...'}
               className="min-w-[200px]"
             >
               {language === 'en' ? 'Give me another fact' : 'Un\'altra curiosità'}
             </Button>

             {/* Next Button */}
             <button
               onClick={handleNext}
               disabled={!canGoForward || loading}
               className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
               aria-label="Next fact"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
               </svg>
             </button>
           </div>
           
           {error && (
             <button 
               onClick={loadFact}
               className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
             >
               {language === 'en' ? 'Try again' : 'Riprova'}
             </button>
           )}
        </section>
      </main>

      <footer className="w-full p-6 text-center z-10">
        <p className="text-xs font-medium text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          Powered by <a href="https://uselessfacts.jsph.pl" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">uselessfacts.jsph.pl</a>
          <br></br>
          Created by Giuseppe Gravagno
        </p>
      </footer>
    </div>
  );
};

export default App;