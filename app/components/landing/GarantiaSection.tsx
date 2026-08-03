import { ShieldCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function GarantiaSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <div className="bg-[#1F3864] text-white rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-blue-900/20 border border-blue-900/50">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-12 h-12 text-teal-400" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4">7 dias de garantia incondicional</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Assine agora, configure suas facções e crie suas primeiras ordens de produção. Se em 7 dias você não sentir que sua produção está mais organizada, devolvemos cada centavo do seu dinheiro. Sem perguntas.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
