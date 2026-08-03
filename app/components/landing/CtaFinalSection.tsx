import { ArrowRight, Scissors } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function CtaFinalSection() {
  return (
    <section className="py-24 px-6 bg-white border-t border-gray-100">
      <ScrollReveal>
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1F3864] to-[#10203a] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 border border-blue-900/30">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20 shadow-xl shadow-blue-900/50">
              <Scissors className="w-8 h-8 text-blue-300" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight">
              Sua confecção merece <br className="hidden md:block" />
              uma gestão profissional.
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Assuma o controle total da sua produção e evite atrasos antes mesmo que eles aconteçam.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://pay.kiwify.com.br/UiNSqS2" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-[#1F3864] text-xl font-bold rounded-full hover:bg-gray-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105"
              >
                Começar agora
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
