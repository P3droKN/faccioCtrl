'use client';

import Link from 'next/link';
import { Scissors } from 'lucide-react';
import { trackEvent } from '@/lib/fbpixel';

export default function LandingNavbar() {

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 text-white font-extrabold text-xl sm:text-2xl tracking-tighter shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Scissors className="w-4 h-4 sm:w-6 sm:h-6 text-blue-300" />
            </div>
            <span className="hidden sm:inline">FaccioCtrl</span>
            <span className="sm:hidden">Faccio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
            {/* Links desktop (se houver) */}
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/login" className="text-white/90 hover:text-white font-medium text-xs sm:text-sm transition-colors">
              Entrar
            </Link>
            <a href="https://pay.kiwify.com.br/UiNSqS2" onClick={() => trackEvent('InitiateCheckout')} className="bg-white text-[#1F3864] px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] whitespace-nowrap">
              Assinar Agora
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
