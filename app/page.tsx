import Link from 'next/link';
import { Scissors } from 'lucide-react';
import LandingNavbar from './components/landing/LandingNavbar';
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
      
      <LandingNavbar />

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
            <a href="/termos" className="hover:text-[#1F3864] transition-colors">Termos de Uso</a>
            <a href="/privacidade" className="hover:text-[#1F3864] transition-colors">Privacidade</a>
            <a href="mailto:suporteplataforma.pkn@gmail.com" className="hover:text-[#1F3864] transition-colors">Contato</a>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} FaccioCtrl. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
