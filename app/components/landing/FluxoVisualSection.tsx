import { ShoppingCart, FileText, Factory, Activity, CheckSquare, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function FluxoVisualSection() {
  const steps = [
    { icon: ShoppingCart, label: 'Pedido Recebido' },
    { icon: FileText, label: 'Ordem de Produção' },
    { icon: Factory, label: 'Envio à Facção' },
    { icon: Activity, label: 'Acompanhamento' },
    { icon: CheckSquare, label: 'Entrega Final' },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-20">
             <h2 className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-3">Fluxo Perfeito</h2>
             <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
               O caminho natural da sua produção
             </h3>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[40%] left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 -z-10 rounded-full"></div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0 w-full lg:w-auto">
                  <ScrollReveal delay={index * 150} className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center justify-center mb-6 relative group transition-transform hover:-translate-y-2">
                       <Icon className="w-10 h-10 text-[#1F3864] group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-3xl transition-colors"></div>
                    </div>
                    <div className="font-bold text-gray-900 text-center max-w-[120px]">{step.label}</div>
                  </ScrollReveal>

                  {index < steps.length - 1 && (
                    <ScrollReveal delay={index * 150 + 100} className="lg:ml-6 lg:mr-2">
                      <ArrowRight className="w-8 h-8 text-blue-300 rotate-90 lg:rotate-0" />
                    </ScrollReveal>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
