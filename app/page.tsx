import Link from 'next/link';
import { Scissors } from 'lucide-react';
import HeroSection from './components/landing/HeroSection';
import DoresSection from './components/landing/DoresSection';
import FuncionalidadesSection from './components/landing/FuncionalidadesSection';
import ComparativoSection from './components/landing/ComparativoSection';
import FluxoVisualSection from './components/landing/FluxoVisualSection';
import PricingSection from './components/landing/PricingSection';
import GarantiaSection from './components/landing/GarantiaSection';
import FaqSection from './components/landing/FaqSection';
import CtaFinalSection from './components/landing/CtaFinalSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-500/30">
      
      {/* Navbar overlaying the Hero */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Scissors className="w-6 h-6 text-blue-300" />
            </div>
            FaccioCtrl
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
            {/* Links removidos conforme solicitado */}
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-white/90 hover:text-white font-medium text-sm transition-colors hidden sm:block">
              Entrar
            </Link>
            <a href="https://pay.kiwify.com.br/UiNSqS2" className="bg-white text-[#1F3864] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Assinar Agora
            </a>
          </div>
        </nav>
      </div>

      <HeroSection />
      <DoresSection />
      <FuncionalidadesSection />
      <ComparativoSection />
      <FluxoVisualSection />
      <PricingSection />
      <GarantiaSection />
      <FaqSection />
      <CtaFinalSection />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-extrabold text-xl text-[#1F3864] tracking-tight">
            <div className="w-8 h-8 bg-[#1F3864] rounded-lg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            FaccioCtrl
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-[#1F3864] transition-colors">Sobre</a>
            <a href="#precos" className="hover:text-[#1F3864] transition-colors">Preços</a>
            <a href="#" className="hover:text-[#1F3864] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[#1F3864] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#1F3864] transition-colors">Contato</a>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} FaccioCtrl. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
