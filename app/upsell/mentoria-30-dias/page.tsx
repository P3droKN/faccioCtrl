import Link from 'next/link';
import { 
  CheckCircle, 
  MessageSquare, 
  Target, 
  LineChart, 
  ShieldCheck, 
  Clock, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { Scissors } from 'lucide-react';

export default function Mentoria30DiasPremium() {
  return (
    <div className="min-h-screen bg-[#0B1221] text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 md:pt-28 md:pb-24">
        {/* Background Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-sm font-medium mb-8">
            <ShieldCheck className="w-4 h-4" /> Oferta Exclusiva de Boas-Vindas
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Transforme seu sistema novo no <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">motor principal</span> da sua confecção
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Vou te revelar exatamente o que as grandes confecções fazem para não abandonar a organização na segunda semana.
          </p>
          
          <a href="#oferta" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1">
            Quero ter sucesso com o sistema
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* 2. O Problema */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Pare de perder dinheiro</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">O cemitério de softwares</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111C33] border border-gray-800 rounded-2xl p-8 hover:border-blue-900/50 transition-colors">
              <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-6 text-red-400">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">A empolgação que dura 7 dias</h4>
              <p className="text-gray-400 leading-relaxed">
                Comprar o FaccioCtrl foi o seu primeiro passo excelente. Mas nós sabemos como é a rotina de uma confecção. Na segunda semana, o volume de trabalho engole a sua intenção de se organizar, e o sistema fica de lado.
              </p>
            </div>
            <div className="bg-[#111C33] border border-gray-800 rounded-2xl p-8 hover:border-blue-900/50 transition-colors">
              <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Eu não vou deixar você desistir</h4>
              <p className="text-gray-400 leading-relaxed">
                Eu sou especialista na ferramenta que construí. Durante os seus primeiros 30 dias, eu serei o seu parceiro de implantação. Vou garantir que o FaccioCtrl seja alimentado corretamente para te dar resultados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Como Funciona (Timeline) */}
      <section className="py-20 px-4 bg-[#080E1A] relative z-10 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-teal-500 uppercase tracking-widest mb-2">O Caminho das Pedras</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">O que acontece nos próximos 30 dias?</h3>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-800 before:to-transparent">
            
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#080E1A] bg-blue-600 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(37,99,235,0.2)] z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#111C33] border border-gray-800 shadow-xl">
                <h4 className="font-bold text-lg text-white mb-1">Semana 1: Setup e Hábitos</h4>
                <p className="text-gray-400 text-sm">Acompanhamento de perto na hora de cadastrar as suas primeiras facções e ordens para criar o hábito sem dor de cabeça.</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#080E1A] bg-gray-800 text-gray-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#111C33] border border-gray-800 shadow-xl">
                <h4 className="font-bold text-lg text-white mb-1">Semana 2: Otimizando o Uso</h4>
                <p className="text-gray-400 text-sm">Vou avaliar como você está usando as telas e corrigir erros comuns para você economizar cliques e tempo.</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#080E1A] bg-gray-800 text-gray-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#111C33] border border-gray-800 shadow-xl">
                <h4 className="font-bold text-lg text-white mb-1">Semana 3: Lendo os Dados</h4>
                <p className="text-gray-400 text-sm">Com o sistema alimentado, vou te ajudar a interpretar os gráficos e o dashboard para achar gargalos na produção.</p>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#080E1A] bg-gray-800 text-gray-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#111C33] border border-gray-800 shadow-xl">
                <h4 className="font-bold text-lg text-white mb-1">Semana 4: Independência</h4>
                <p className="text-gray-400 text-sm">Entrega do seu diagnóstico de implantação, com dicas de ouro sobre como explorar o máximo do FaccioCtrl sozinho.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Entregáveis */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Entregáveis</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">O que você leva ao entrar hoje</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111C33]/80 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
              <MessageSquare className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Acesso no Telegram</h4>
              <p className="text-gray-400 text-sm">Comunicação direta via áudio ou texto. Sem agendamento de chamadas chatas.</p>
            </div>
            <div className="bg-[#111C33]/80 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-teal-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">4 Check-ins Ativos</h4>
              <p className="text-gray-400 text-sm">Toda semana eu vou te chamar para saber se o sistema travou na sua rotina e te dar a solução.</p>
            </div>
            <div className="bg-[#111C33]/80 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
              <Target className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Foco no Software</h4>
              <p className="text-gray-400 text-sm">Análises precisas de como melhorar a sua organização interna utilizando a nossa plataforma.</p>
            </div>
            <div className="bg-[#111C33]/80 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
              <LineChart className="w-8 h-8 text-teal-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Plano de Independência</h4>
              <p className="text-gray-400 text-sm">Um mini-diagnóstico final validando que a sua confecção já sabe usar a tecnologia a seu favor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Oferta e Checkout */}
      <section id="oferta" className="py-20 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          
          <div className="bg-gradient-to-b from-[#162442] to-[#0B1221] border border-blue-900/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Glow effect behind pricing card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-500/20 blur-[80px] pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
              <div className="w-16 h-16 bg-[#1F3864] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-blue-800/50">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Mentoria 30 Dias FaccioCtrl</h3>
              <p className="text-gray-400">Garanta a implementação perfeita do seu sistema.</p>
            </div>

            {/* Kiwify Injection Point */}
            <div 
              className="relative z-10 text-center"
              id="kiwify-upsell-D69bSgI" 
              data-upsell-url="https://faccioctrl.vercel.app/obrigado" 
              data-downsell-url="https://faccioctrl.vercel.app/obrigado"
            >
              <div className="mb-8">
                <span className="text-gray-400 uppercase tracking-wider text-sm font-semibold">Investimento Único</span>
                <div className="text-5xl md:text-6xl font-extrabold text-white mt-2 drop-shadow-md">
                  R$ 197<span className="text-2xl text-gray-400 font-semibold">,00</span>
                </div>
              </div>

              <button 
                id="kiwify-upsell-trigger-D69bSgI"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg md:text-xl py-5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5"
              >
                Sim, quero a Mentoria de 30 Dias!
              </button>
              
              <div className="mt-8">
                <Link 
                  href="/obrigado" 
                  id="kiwify-upsell-cancel-trigger-D69bSgI"
                  className="text-sm text-gray-500 hover:text-gray-300 underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Não, obrigado. Eu consigo implantar sozinho.
                </Link>
              </div>
            </div>

            {/* Garantia */}
            <div className="mt-12 pt-8 border-t border-gray-800 flex items-center justify-center gap-4 text-gray-400 text-sm">
              <ShieldCheck className="w-8 h-8 text-gray-500" />
              <div className="text-left">
                <p className="font-bold text-gray-300">Risco Zero - Garantia de 7 Dias</p>
                <p>Se você não gostar do acompanhamento, devolvo o valor da mentoria.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <script src="https://snippets.kiwify.com/upsell/upsell.min.js" async></script>
      
      {/* CSS Forçado para dropdowns ou elementos injetados pela Kiwify manterem padrão dark se necessário */}
      <style dangerouslySetInnerHTML={{__html: `
        select, option {
          background-color: #111C33 !important;
          color: #ffffff !important;
          font-weight: 500 !important;
          border-color: #374151 !important;
        }
      `}} />
    </div>
  );
}
