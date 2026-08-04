'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scissors, Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Scissors className="w-6 h-6 text-blue-300" />
            </div>
            FaccioCtrl
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
            {/* Links desktop (se houver) */}
          </div>
          
          <div className="hidden sm:flex items-center gap-5">
            <Link href="/login" className="text-white/90 hover:text-white font-medium text-sm transition-colors">
              Entrar
            </Link>
            <a href="https://pay.kiwify.com.br/UiNSqS2" className="bg-white text-[#1F3864] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Assinar Agora
            </a>
          </div>

          <div className="sm:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="sm:hidden absolute top-full left-4 right-4 bg-[#1F3864]/95 backdrop-blur-md rounded-2xl p-4 mt-2 border border-white/10 shadow-2xl flex flex-col gap-4">
            <Link href="/login" className="text-white text-center font-medium py-2 hover:bg-white/10 rounded-lg transition-colors">
              Entrar
            </Link>
            <a href="https://pay.kiwify.com.br/UiNSqS2" className="bg-white text-[#1F3864] text-center px-6 py-3 rounded-xl font-bold transition-all shadow-lg">
              Assinar Agora
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}
