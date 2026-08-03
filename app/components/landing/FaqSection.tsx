'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function FaqSection() {
  const faqs = [
    {
      question: 'Preciso instalar algum programa no computador?',
      answer: 'Não. O FaccioCtrl funciona 100% na nuvem. Você acessa pelo navegador do seu celular, tablet ou computador de qualquer lugar, basta ter internet.'
    },
    {
      question: 'Minhas facções precisam usar o aplicativo?',
      answer: 'Não é obrigatório. O sistema foi desenhado para organizar o SEU controle. Você atualiza as ordens de produção internamente. Se a facção quiser acessar, é um bônus, mas o controle está na sua mão.'
    },
    {
      question: 'Existe limite de usuários ou ordens de produção?',
      answer: 'Não! Você pode cadastrar quantas ordens de produção, lotes, facções e referências precisar. O valor da assinatura é fixo e não aumenta com o seu volume de produção.'
    },
    {
      question: 'E se eu tiver dificuldade de usar?',
      answer: 'O FaccioCtrl foi criado para ser extremamente simples e visual. Mas se tiver qualquer dúvida, temos suporte via e-mail e WhatsApp para ajudar você a configurar tudo rapidamente.'
    },
    {
      question: 'Como funciona o cancelamento?',
      answer: 'Você pode cancelar sua assinatura a qualquer momento direto pelo painel, sem taxas escondidas, sem multas e sem burocracia.'
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Sim. Utilizamos servidores de alta segurança e criptografia de ponta a ponta. Apenas você tem acesso aos dados da sua produção e das suas facções parceiras.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Perguntas que todo dono de confecção faz
            </h2>
            <p className="text-lg text-gray-600">Ainda com dúvidas? Nós respondemos.</p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 50}>
              <div 
                className={`bg-white border transition-colors rounded-2xl overflow-hidden ${openIndex === index ? 'border-blue-400 shadow-md shadow-blue-900/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
