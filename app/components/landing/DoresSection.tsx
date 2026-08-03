import { XCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function DoresSection() {
  const dores = [
    { title: 'Pedidos espalhados no WhatsApp', desc: 'Você precisa rolar conversas infinitas para lembrar o que mandou para quem, e quando deveria voltar.' },
    { title: 'Não sabe qual facção está atrasada', desc: 'Só descobre que a produção está parada quando o lojista cobra a mercadoria ou quando já é tarde demais.' },
    { title: 'Perde prazos sem perceber', desc: 'A falta de controle visual faz com que lotes fiquem esquecidos nas oficinas parceiras por semanas.' },
    { title: 'Planilhas que ninguém entende', desc: 'Tentou usar o Excel, mas ele ficou pesado, cheio de erros de fórmula e ninguém da equipe consegue atualizar direito.' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Sua produção ainda funciona assim?
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dores.map((dor, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl h-full hover:shadow-lg transition-shadow">
                <XCircle className="w-10 h-10 text-red-500 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{dor.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{dor.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
