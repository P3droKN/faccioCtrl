'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  initialStatus: string;
}

export default function SubscriptionGate({ initialStatus }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  // Polling loop
  useEffect(() => {
    if (!isConfirming) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/auth/status');
        if (res.ok) {
          const data = await res.json();
          if (data.plano === 'pro') {
            // O webhook bateu e liberou!
            clearInterval(interval);
            router.refresh();
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000); // Poll a cada 3 segundos

    return () => clearInterval(interval);
  }, [isConfirming, router]);

  const handleCheckout = (url: string) => {
    // Abrir kiwify na mesma aba ou em aba nova?
    // A Kiwify envia o usuário de volta via "URL de redirecionamento" configurada no painel deles.
    // Mas para garantir a fluidez, vamos abrir em nova aba e ficar fazendo polling aqui.
    window.open(url, '_blank');
    setIsConfirming(true);
  };

  if (isConfirming) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Estamos confirmando seu pagamento...</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Por favor, não feche esta página. Assim que a Kiwify confirmar a transação, seu acesso será liberado automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Finalize seu cadastro para começar a usar o FaccioCtrl
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          {initialStatus === 'cancelado' 
            ? 'Sua assinatura foi cancelada. Escolha um plano abaixo para reativar seu acesso.'
            : 'Escolha o plano ideal para a sua confecção e tenha controle total sobre a sua produção.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Plano Mensal */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-xl shadow-gray-200/40 relative flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Plano Mensal</h3>
            <p className="text-gray-500 mt-2">Flexibilidade para o seu negócio.</p>
          </div>
          
          <div className="mb-8 flex-1">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-sm font-bold text-gray-400 line-through">R$ 53,90</span>
              <span className="text-5xl font-extrabold text-gray-900">R$ 26<span className="text-lg">,00</span></span>
            </div>
            <p className="text-sm font-semibold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full mb-6">
              Primeiro mês por R$26
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> Depois R$53,90/mês
              </li>
              <li className="flex items-center gap-3 text-gray-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> Cobrança mensal automática
              </li>
              <li className="flex items-center gap-3 text-gray-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> Cancele quando quiser
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout('https://pay.kiwify.com.br/UiNSqS2')}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg transition-all"
          >
            <CreditCard className="w-5 h-5" /> Assinar Mensal
          </button>
        </div>

        {/* Plano Anual */}
        <div className="bg-gradient-to-b from-[#1F3864] to-[#12223e] rounded-3xl p-8 border-2 border-[#2a4a82] shadow-2xl shadow-blue-900/40 relative flex flex-col text-white">
          <div className="absolute top-0 right-8 -translate-y-1/2">
            <span className="bg-blue-500 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
              Mais Vantajoso
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold">Plano Anual</h3>
            <p className="text-blue-200 mt-2">Maior economia a longo prazo.</p>
          </div>
          
          <div className="mb-8 flex-1">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold">R$ 44<span className="text-lg">,90</span></span>
              <span className="text-blue-200">/mês</span>
            </div>
            <p className="text-sm font-semibold text-blue-200 mb-6">
              Cobrado anualmente (R$538,80 à vista)
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-medium text-blue-100">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Desconto no valor total
              </li>
              <li className="flex items-center gap-3 font-medium text-blue-100">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Pagamento único anual
              </li>
              <li className="flex items-center gap-3 font-medium text-blue-100">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Todos os recursos inclusos
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout('https://pay.kiwify.com.br/c9YTH72')}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30"
          >
            <CreditCard className="w-5 h-5" /> Assinar Anual
          </button>
        </div>
      </div>
    </div>
  );
}
