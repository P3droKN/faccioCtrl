import Link from 'next/link';
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
            <div className="mb-6">
              <span className="text-gray-500 uppercase tracking-wider text-sm font-semibold">Pagamento Único</span>
              <div className="text-5xl font-extrabold text-gray-900 mt-2">R$ 67<span className="text-2xl text-gray-500">,00</span></div>
            </div>

            <button 
              id="kiwify-upsell-accept"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Sim, quero a Configuração Expressa
            </button>
            
            <div className="mt-6">
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors">
                Não, obrigado, prefiro configurar sozinho
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* COLAR AQUI O SNIPPET DE UPSELL GERADO PELA KIWIFY */}
      {/* Exemplo: <script src="https://pay.kiwify.com.br/upsell.js"></script> */}
    </div>
  );
}
