import { CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function PricingSection() {
  return (
    <section id="precos" className="py-24 bg-gray-50 border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
               Trave o preço de hoje. <span className="text-blue-600">Pra sempre.</span>
             </h2>
             <p className="text-lg text-gray-600 leading-relaxed mb-12">
               O FaccioCtrl está crescendo rápido. Quem assina hoje garante as novas funcionalidades futuras sem pagar a mais por isso.
             </p>
             
             {/* Timeline de preço */}
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mb-16">
                <div className="text-center">
                  <div className="text-sm text-gray-400 font-bold mb-1">Lançamento</div>
                  <div className="text-2xl font-black text-gray-300 line-through">R$ 26</div>
                </div>
                <div className="hidden sm:block h-0.5 w-12 bg-gray-200"></div>
                <div className="text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Você está aqui</div>
                  <div className="text-sm text-blue-600 font-bold mb-1 mt-2">HOJE (Travado)</div>
                  <div className="text-3xl font-black text-gray-900">R$ 53,90</div>
                </div>
                <div className="hidden sm:block h-0.5 w-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 font-bold mb-1">Amanhã</div>
                  <div className="text-2xl font-black text-gray-400">R$ ??,??</div>
                </div>
             </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Mensal */}
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-3xl p-8 lg:p-10 border-2 border-gray-100 shadow-xl shadow-gray-200/40 relative flex flex-col hover:border-blue-100 transition-colors h-full">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Plano Mensal</h3>
                <p className="text-gray-500 mt-2">Flexibilidade total para o seu negócio.</p>
              </div>
              
              <div className="mb-8 flex-1">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-gray-900">R$ 53<span className="text-lg">,90</span></span>
                  <span className="text-gray-500 font-medium">/mês</span>
                </div>
                <p className="text-sm font-semibold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full mb-6">
                  Primeira cobrança de R$26
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> Gestão ilimitada de Facções
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> Ordens de Produção ilimitadas
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> Dashboard Analytics completo
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> Cancele quando quiser
                  </li>
                </ul>
              </div>

              <a
                href="https://pay.kiwify.com.br/UiNSqS2"
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg transition-all"
              >
                Assinar Mensal
              </a>
            </div>
          </ScrollReveal>

          {/* Plano Anual */}
          <ScrollReveal delay={200}>
            <div className="bg-gradient-to-b from-[#1F3864] to-[#12223e] rounded-3xl p-8 lg:p-10 border-2 border-[#2a4a82] shadow-2xl shadow-blue-900/40 relative flex flex-col text-white h-full transform md:-translate-y-4">
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="bg-blue-500 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                  Mais Vantajoso
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold">Plano Anual</h3>
                <p className="text-blue-200 mt-2">Maior economia e tranquilidade a longo prazo.</p>
              </div>
              
              <div className="mb-8 flex-1">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-extrabold">R$ 499<span className="text-lg">,90</span></span>
                  <span className="text-blue-200 font-medium">/ano</span>
                </div>
                <p className="text-sm font-semibold text-blue-200 mb-6">
                  ou 12x de R$51,70
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 font-medium text-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Gestão ilimitada de Facções
                  </li>
                  <li className="flex items-center gap-3 font-medium text-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Ordens de Produção ilimitadas
                  </li>
                  <li className="flex items-center gap-3 font-medium text-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Dashboard Analytics completo
                  </li>
                  <li className="flex items-center gap-3 font-medium text-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Cobrado R$499,90 uma vez por ano
                  </li>
                </ul>
              </div>

              <a
                href="https://pay.kiwify.com.br/bAH6nkn"
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30"
              >
                Assinar Anual
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
