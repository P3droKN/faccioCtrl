import Link from 'next/link';
import { ArrowRight, CheckCircle2, TrendingDown, TrendingUp, Scissors, Search, Bell } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#1F3864] via-[#2A4B86] to-[#3B6BAE] overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-40">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              O sistema #1 para gestão de oficinas de costura
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
              Pare de controlar facções pelo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">WhatsApp.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg lg:text-2xl text-blue-100/90 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Centralize os pedidos, acompanhe os prazos em tempo real e saiba exatamente quem está atrasado. Sem planilhas, sem confusão.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a 
                href="https://pay.kiwify.com.br/UiNSqS2" 
                className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-gray-100 text-[#1F3864] rounded-full font-bold text-xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.6)] transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Começar agora
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-blue-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" /> Produção organizada
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" /> Sem planilhas
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" /> Sem mensagens perdidas
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right: Dashboard Mockup */}
        <div className="flex-1 w-full max-w-2xl relative perspective-1000 hidden md:block">
          <ScrollReveal delay={500} className="relative transform lg:-rotate-y-12 lg:rotate-x-6 lg:scale-105 transition-transform duration-700 hover:rotate-0 hover:scale-110">
            
            <div className="bg-gray-50 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-gray-200 relative z-20">
              
              {/* Window Controls / Fake Browser */}
              <div className="bg-gray-200 border-b border-gray-300 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
                </div>
                <div className="bg-white text-xs font-medium text-gray-500 px-4 py-1 rounded shadow-sm">
                  app.faccioctrl.com.br
                </div>
                <div className="w-16"></div>
              </div>

              {/* FaccioCtrl Navbar */}
              <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-[#1F3864]">
                  <div className="w-8 h-8 bg-[#1F3864] rounded flex items-center justify-center">
                    <Scissors className="w-4 h-4 text-white" />
                  </div>
                  FaccioCtrl
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <Search className="w-5 h-5" />
                  <Bell className="w-5 h-5" />
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    JD
                  </div>
                </div>
              </div>
              
              {/* Mockup Content */}
              <div className="p-6">
                <h3 className="font-extrabold text-[#1F3864] text-xl mb-6">Desempenho das Facções</h3>
                
                {/* Table Header */}
                <div className="bg-white rounded-t-xl border border-gray-200 p-4 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <div className="w-2/5">Facção</div>
                  <div className="w-1/5 text-center">Taxa de Atraso</div>
                  <div className="w-2/5 text-right">Status da Parceria</div>
                </div>
                
                {/* Table Rows */}
                <div className="bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
                  
                  {/* Row 1 - Costura Express (Red) */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
                    <div className="w-2/5 font-bold text-gray-900">Costura Express</div>
                    <div className="w-1/5 text-center">
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-1 rounded-full text-sm">
                        <TrendingDown className="w-4 h-4" /> 45%
                      </span>
                    </div>
                    <div className="w-2/5 text-right">
                      <span className="text-red-500 font-medium text-sm">Atrasos Críticos</span>
                    </div>
                  </div>

                  {/* Row 2 - Oficina Silva (Green) */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
                    <div className="w-2/5 font-bold text-gray-900">Oficina Silva</div>
                    <div className="w-1/5 text-center">
                      <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full text-sm">
                        <TrendingUp className="w-4 h-4" /> 5%
                      </span>
                    </div>
                    <div className="w-2/5 text-right">
                      <span className="text-green-600 font-medium text-sm">Excelente</span>
                    </div>
                  </div>

                  {/* Row 3 - Ateliê Central (Yellow) */}
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="w-2/5 font-bold text-gray-900">Ateliê Central</div>
                    <div className="w-1/5 text-center">
                      <span className="inline-flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-2 py-1 rounded-full text-sm">
                        18%
                      </span>
                    </div>
                    <div className="w-2/5 text-right">
                      <span className="text-yellow-600 font-medium text-sm">Atenção</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 rounded-full blur-[100px] -z-10"></div>
          </ScrollReveal>
        </div>

      </div>
      
      {/* Curved Divider at the bottom */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.7,196.36,110.14C240.28,101.12,282.8,80.7,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
}
