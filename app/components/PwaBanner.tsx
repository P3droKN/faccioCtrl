'use client';

import { useState, useEffect } from 'react';
import { Download, X, Scissors } from 'lucide-react';

export default function PwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verifica se o evento já foi capturado pelo script no head
    if (typeof window !== 'undefined' && (window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
      setShowBanner(true);
    }

    // Listener direto caso o evento chegue depois
    const handler = (e: any) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Polling: o evento pode chegar entre o script do head e o React montar
    const interval = setInterval(() => {
      if ((window as any).deferredPwaPrompt) {
        setDeferredPrompt((window as any).deferredPwaPrompt);
        setShowBanner(true);
        clearInterval(interval);
      }
    }, 1000);

    // Limpar após 15 segundos se não disparou
    const timeout = setTimeout(() => clearInterval(interval), 15000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearInterval(interval);
      clearTimeout(timeout);
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
    <div className="hidden lg:flex fixed bottom-0 left-0 right-0 z-40 bg-[#1F3864] text-white border-t border-blue-900 shadow-2xl py-4 px-6 animate-in slide-in-from-bottom-5">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
            <Scissors className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Acesse pelo computador e instale o FaccioCtrl como aplicativo</h4>
            <p className="text-white/70 text-xs">Tenha acesso mais rápido e controle suas facções direto da área de trabalho.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={handleInstall}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F3864] font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Download className="w-4 h-4" />
            Instalar agora
          </button>
          <button 
            onClick={() => setShowBanner(false)}
            className="flex items-center justify-center w-8 h-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
