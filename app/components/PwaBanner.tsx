'use client';

import { useState, useEffect } from 'react';
import { Download, X, Scissors } from 'lucide-react';

export default function PwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the banner
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação do PWA');
    } else {
      console.log('Usuário recusou a instalação do PWA');
    }
    
    // Clear the deferredPrompt and hide the banner
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="hidden lg:flex fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 flex items-center gap-5 w-[420px]">
        <div className="w-12 h-12 bg-[#1F3864] rounded-xl flex items-center justify-center shrink-0 shadow-inner">
          <Scissors className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-gray-900 font-bold text-sm">FaccioCtrl</h4>
          <p className="text-gray-500 text-xs mt-0.5 leading-snug">Instale o FaccioCtrl no seu computador para acesso rápido.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleInstall}
            className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            title="Instalar agora"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowBanner(false)}
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
