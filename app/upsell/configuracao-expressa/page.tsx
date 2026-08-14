import Link from 'next/link';
import Script from 'next/script';
import { CheckCircle, Clock } from 'lucide-react';

export default function ConfiguracaoExpressaUpsell() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header/Hero area */}
        <div className="bg-[#1F3864] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">Espera! Que tal eu configurar tudo pra você?</h1>
          <p className="text-blue-100 text-lg max-w-lg mx-auto relative z-10">
            Pule a etapa chata de preencher dados e comece a usar o FaccioCtrl imediatamente.
          </p>
        </div>

        {/* Content area */}
        <div className="p-8 md:p-10 space-y-8">
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="bg-white p-4 rounded-full shadow-sm text-blue-600 shrink-0">
              <Clock className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Configuração Expressa em 48h</h3>
              <p className="text-gray-600 leading-relaxed">
                Cadastro de até <strong className="text-gray-900">10 facções</strong> + <strong className="text-gray-900">20 ordens de produção</strong>. Tudo por mensagem (áudio, foto ou texto) — você só me manda os dados pelo WhatsApp e eu deixo o sistema pronto pra usar.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">O que está incluso:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Criação dos perfis detalhados de até 10 facções parceiras.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Lançamento do histórico das últimas 20 ordens de produção.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Zero preenchimento manual da sua parte — basta me enviar foto do caderno ou planilhas.</span>
              </li>
            </ul>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-6 border-t border-gray-100 text-center">
            <div className="w-full text-center" id="kiwify-upsell-kBycMUu" data-upsell-url="https://faccioctrl.vercel.app/upsell/auditoria" data-downsell-url="https://faccioctrl.vercel.app/upsell/auditoria">
              <button 
                id="kiwify-upsell-trigger-kBycMUu" 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl w-full text-lg transition-colors border-none cursor-pointer"
              >
                Sim, quero a Configuração Expressa
              </button>
              <div 
                id="kiwify-upsell-cancel-trigger-kBycMUu" 
                className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline cursor-pointer transition-colors"
              >
                Não, obrigado, prefiro configurar sozinho
              </div>
            </div>
            {/* Script para repassar os tokens de sessão da Kiwify para a próxima página */}
            <Script id="forward-kiwify-params" strategy="afterInteractive">
              {`
                setTimeout(() => {
                  const query = window.location.search;
                  if (query) {
                    const container = document.getElementById('kiwify-upsell-kBycMUu');
                    if (container) {
                      const url = 'https://faccioctrl.vercel.app/upsell/auditoria';
                      container.setAttribute('data-upsell-url', url + query);
                      container.setAttribute('data-downsell-url', url + query);
                    }
                  }
                }, 500);
              `}
            </Script>
          </div>

        </div>
      </div>

      <Script src="https://snippets.kiwify.com/upsell/upsell.min.js" strategy="beforeInteractive" />
      
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
