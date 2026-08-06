import Link from 'next/link';
import { CheckCircle, Users } from 'lucide-react';

export default function Mentoria30DiasUpsell() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header/Hero area */}
        <div className="bg-[#1F3864] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">Não deixe seu sistema novo virar mais um projeto abandonado</h1>
          <p className="text-blue-100 text-lg max-w-lg mx-auto relative z-10">
            Eu quero que você tenha sucesso com o FaccioCtrl. Por isso, criei a Mentoria de 30 Dias.
          </p>
        </div>

        {/* Content area */}
        <div className="p-8 md:p-10 space-y-8">
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="bg-white p-4 rounded-full shadow-sm text-blue-600 shrink-0">
              <Users className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Acompanhamento por WhatsApp</h3>
              <p className="text-gray-600 leading-relaxed">
                O maior risco de qualquer sistema novo é você instalar e largar na segunda semana. Eu quero que isso não aconteça. Por isso criei a Mentoria de 30 Dias: vou acompanhar você pessoalmente por WhatsApp durante o primeiro mês — check-in toda semana, dicas baseadas no SEU uso, e um plano para o próximo mês no final. Sem chamada, sem compromisso de horário. Você responde quando puder, eu respondo com análise personalizada.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Benefícios da Mentoria de 30 Dias:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>4 check-ins semanais personalizados</strong> baseados no seu uso do sistema.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Acesso prioritário</strong> para dúvidas sobre o sistema e sobre gestão de facções.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Mini relatório final</strong> com um plano claro de próximos passos.</span>
              </li>
            </ul>
          </div>

          {/* Pricing & CTA */}
          <div 
            className="pt-6 border-t border-gray-100 text-center"
            id="kiwify-upsell-D69bSgI" 
            data-upsell-url="https://faccioctrl.vercel.app/dashboard" 
            data-downsell-url="https://faccioctrl.vercel.app/dashboard"
          >
            <div className="mb-6">
              <span className="text-gray-500 uppercase tracking-wider text-sm font-semibold">Pagamento Único</span>
              <div className="text-5xl font-extrabold text-gray-900 mt-2">R$ 197<span className="text-2xl text-gray-500">,00</span></div>
            </div>

            <button 
              id="kiwify-upsell-trigger-D69bSgI"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Sim, quero a Mentoria de 30 Dias
            </button>
            
            <div className="mt-6">
              <Link 
                href="/dashboard" 
                id="kiwify-upsell-cancel-trigger-D69bSgI"
                className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Não, obrigado
              </Link>
            </div>
          </div>

        </div>
      </div>

      <script src="https://snippets.kiwify.com/upsell/upsell.min.js" async></script>
      
      {/* Força a cor do texto do dropdown (select) injetado pela Kiwify para ficar escuro e legível */}
      <style dangerouslySetInnerHTML={{__html: `
        select, option {
          color: #111827 !important;
          font-weight: 500 !important;
        }
      `}} />
    </div>
  );
}
