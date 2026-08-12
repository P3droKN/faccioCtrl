import React from 'react';
import Script from 'next/script';
import { ShieldAlert, Zap, MessageCircle, BarChart3, Clock, CheckCircle } from 'lucide-react';

export default function UpsellAuditoriaPage() {
  return (
    <div className="min-h-screen bg-[#040814] selection:bg-blue-500/30">
      {/* 1. Header & Hero */}
      <header className="relative pt-12 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10 opacity-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#040814] to-[#040814]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 font-medium text-sm mb-8">
            <ShieldAlert className="w-4 h-4" />
            Oferta Especial Única (Você não verá isso novamente)
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Não deixe as facções atrasarem os seus pedidos. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Automatize sua cobrança.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Desbloqueie o <strong className="text-white">Módulo de Auditoria Ativa</strong>. O FaccioCtrl vai rastrear todas as suas ordens, identificar atrasos e te dar um botão para cobrar a facção pelo WhatsApp em 1 segundo.
          </p>
        </div>
      </header>

      {/* 2. O Problema */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">O Fim da Cobrança Manual</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">Como funciona o Módulo de Auditoria?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111C33] border border-gray-800 rounded-2xl p-8 hover:border-blue-900/50 transition-colors">
              <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-6 text-red-400">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">1. Rastreamento 24/7</h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                O sistema escaneia o banco de dados todos os dias e separa imediatamente as ordens que passaram da data de entrega acordada.
              </p>
            </div>
            
            <div className="bg-[#111C33] border border-gray-800 rounded-2xl p-8 hover:border-blue-900/50 transition-colors">
              <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-6 text-yellow-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">2. Painel de Alerta</h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                Você acessa a tela exclusiva de "Auditoria" e vê uma lista vermelha com o nome da facção, a peça e quantos dias de atraso ela tem.
              </p>
            </div>

            <div className="bg-[#111C33] border border-gray-800 rounded-2xl p-8 hover:border-blue-900/50 transition-colors">
              <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-6 text-green-400">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">3. Cobrança em 1 Clique</h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                Ao lado do alerta, você clica no botão do WhatsApp e o sistema já abre a conversa com a facção com um texto pronto de cobrança.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA & Kiwify Snippet */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#111C33] to-[#080E1A] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
          
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Adicione o Módulo de Auditoria à sua conta</h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Por um pagamento único (sem mensalidades extras), você libera essa tela para sempre na sua conta FaccioCtrl. Economize horas de estresse e garanta que nenhuma peça se perca.
          </p>
          
          <div className="w-full flex justify-center">
            <div className="w-full text-center" id="kiwify-upsell-yjPCVq9" data-upsell-url="https://faccioctrl.vercel.app/obrigado" data-downsell-url="https://faccioctrl.vercel.app/obrigado">
              <button 
                id="kiwify-upsell-trigger-yjPCVq9" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl w-full max-w-[400px] text-lg transition-colors border-none cursor-pointer"
              >
                Sim, quero liberar a Auditoria!
              </button>
              <div 
                id="kiwify-upsell-cancel-trigger-yjPCVq9" 
                className="mt-6 text-sm text-gray-500 hover:text-gray-400 underline cursor-pointer transition-colors"
              >
                Não, prefiro cobrar os atrasos manualmente
              </div>
            </div>
          </div>

          <Script src="https://snippets.kiwify.com/upsell/upsell.min.js" strategy="beforeInteractive" />

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-teal-500" />
            <span>Liberação imediata no seu painel</span>
          </div>

        </div>
      </section>
    </div>
  );
}
