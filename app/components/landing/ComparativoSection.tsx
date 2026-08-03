import { ArrowRight, ClipboardList, CheckSquare, Eye, Zap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ComparativoSection() {
  const steps = [
    {
      icon: ClipboardList,
      color: 'blue',
      voce: 'Você cria a ordem de produção',
      nos: 'FaccioCtrl calcula o status automaticamente',
    },
    {
      icon: CheckSquare,
      color: 'teal',
      voce: 'Você registra a devolução',
      nos: 'FaccioCtrl atualiza o desempenho da facção',
    },
    {
      icon: Eye,
      color: 'purple',
      voce: 'Você abre o aplicativo',
      nos: 'FaccioCtrl mostra quem está atrasado',
    }
  ];

  return (
    <section className="py-24 bg-gray-50 border-y border-gray-200 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              A Sua Parte
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Nós simplificamos o processo para você focar no que importa. Você dá a informação inicial, nós fazemos todo o trabalho pesado nos bastidores.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            // Configurar cores baseado no item
            const bgLight = 
              step.color === 'blue' ? 'bg-blue-50/50' : 
              step.color === 'teal' ? 'bg-teal-50/50' : 
              'bg-purple-50/50';
            
            const iconBg = 
              step.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
              step.color === 'teal' ? 'bg-teal-100 text-teal-600' : 
              'bg-purple-100 text-purple-600';

            return (
              <ScrollReveal key={index} delay={index * 100}>
                <div className={`flex flex-col md:flex-row items-stretch rounded-3xl overflow-hidden shadow-lg border border-gray-100 group transition-all hover:shadow-xl ${bgLight}`}>
                  
                  {/* Left Column - User Action */}
                  <div className="flex-1 p-6 md:p-8 flex items-center gap-5 relative overflow-hidden">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Você faz</div>
                      <div className="text-xl md:text-2xl font-bold text-gray-900">{step.voce}</div>
                    </div>
                  </div>
                  
                  {/* Middle Arrow Connector */}
                  <div className="hidden md:flex items-center justify-center -mx-4 z-10 relative">
                    <div className="w-12 h-12 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center shadow-sm text-blue-400 group-hover:scale-110 group-hover:text-blue-600 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="md:hidden flex justify-center -my-3 z-10 relative">
                    <div className="w-10 h-10 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center shadow-sm text-blue-400">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                  
                  {/* Right Column - FaccioCtrl Action */}
                  <div className="flex-1 p-6 md:p-8 bg-[#1F3864] flex items-center gap-5 justify-end relative overflow-hidden">
                    {/* Dark glow effect inside the right card */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="text-left md:text-right relative z-10 w-full">
                      <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1.5 flex items-center md:justify-end gap-1.5">
                        <Zap className="w-3 h-3" /> FaccioCtrl faz
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-white leading-tight">{step.nos}</div>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
