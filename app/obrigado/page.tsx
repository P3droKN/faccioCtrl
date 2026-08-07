import Link from 'next/link';
import { CheckCircle, Mail, MessageCircle, Scissors, ArrowRight } from 'lucide-react';

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-blue-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header/Hero area */}
        <div className="bg-[#1F3864] text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Pagamento Aprovado com Sucesso! 🎉
            </h1>
            <p className="text-blue-100 text-lg max-w-lg mx-auto">
              Muito obrigado pela confiança. Sua transação foi confirmada e as instruções já foram enviadas para o seu e-mail.
            </p>
          </div>
        </div>

        {/* Content area */}
        <div className="p-8 md:p-10 space-y-8">
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Seu acesso está pronto</h2>
            <p className="text-gray-600">
              Você já pode acessar o sistema imediatamente e começar a organizar sua confecção de forma inteligente.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Precisa de ajuda ou suporte?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Nossa equipe está sempre à disposição para garantir que você tenha a melhor experiência possível. Se tiver qualquer dúvida, é só nos chamar:
            </p>
            
            <div className="space-y-3">
              <a href="mailto:suporteplataforma.pkn@gmail.com" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">E-mail de Suporte</div>
                  <div className="text-sm font-medium text-gray-900">suporteplataforma.pkn@gmail.com</div>
                </div>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 text-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1F3864] hover:bg-[#162442] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Scissors className="w-5 h-5" />
              Acessar meu sistema agora
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} FaccioCtrl. Todos os direitos reservados.
      </div>
    </div>
  );
}
