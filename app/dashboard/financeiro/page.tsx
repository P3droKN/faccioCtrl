'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, CheckCircle2, Wallet, Factory } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getTransacoes, getResumoFinanceiro, marcarComoPago } from '@/app/actions/financeiro';
import { TransacaoModal } from './components/TransacaoModal';

// This is client-side, but ideally the feature flag check is also applied here or in layout.
// Since NEXT_PUBLIC env vars are available on the client:
if (process.env.NEXT_PUBLIC_FEATURE_FINANCEIRO !== 'true') {
  redirect('/dashboard');
}

interface Transacao {
  id: number;
  tipo: 'ENTRADA' | 'SAIDA';
  categoria: string;
  descricao: string | null;
  valor: any; // Decimal from Prisma comes as object or string usually, we cast or convert
  dataVencimento: Date | string;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
  faccao?: { nome: string } | null;
}

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<'VISAO_GERAL' | 'A_PAGAR' | 'A_RECEBER'>('VISAO_GERAL');
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState({ totalReceber: 0, totalPagar: 0, saldoPrevisto: 0 });
  const [loading, setLoading] = useState(true);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resTransacoes, resResumo] = await Promise.all([
        getTransacoes(),
        getResumoFinanceiro()
      ]);
      setTransacoes(resTransacoes as any);
      setResumo(resResumo);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarcarComoPago = (id: number) => {
    startTransition(async () => {
      const res = await marcarComoPago(id);
      if (res.error) alert(res.error);
      else fetchData();
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const aPagar = transacoes.filter(t => t.tipo === 'SAIDA');
  const aReceber = transacoes.filter(t => t.tipo === 'ENTRADA');

  const renderTable = (data: Transacao[], type: 'ENTRADA'|'SAIDA') => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-gray-500">
          <Wallet className="w-12 h-12 text-gray-300 mb-4" />
          <p>Nenhuma transação {type === 'ENTRADA' ? 'a receber' : 'a pagar'} cadastrada.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {['Facção', 'Categoria', 'Descrição', 'Valor', 'Vencimento', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                    {t.faccao?.nome ? (
                      <div className="flex items-center gap-1.5"><Factory className="w-3.5 h-3.5 text-gray-400"/> {t.faccao.nome}</div>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{t.categoria}</td>
                  <td className="px-4 py-3.5 text-gray-500 truncate max-w-[200px]">{t.descricao || '—'}</td>
                  <td className="px-4 py-3.5 font-bold whitespace-nowrap" style={{ color: t.tipo === 'ENTRADA' ? '#16a34a' : '#dc2626' }}>
                    {formatCurrency(Number(t.valor))}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                    {new Date(t.dataVencimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      t.status === 'PAGO' ? 'bg-green-100 text-green-700' :
                      t.status === 'ATRASADO' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {t.status !== 'PAGO' && (
                      <button
                        onClick={() => handleMarcarComoPago(t.id)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-lg hover:bg-green-50"
                        title="Marcar como Pago"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-sm text-gray-500 mt-0.5">Controle de pagamentos e recebimentos</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1F3864] hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Novo Lançamento
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('VISAO_GERAL')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'VISAO_GERAL' ? 'border-[#1F3864] text-[#1F3864]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Visão Geral
        </button>
        <button 
          onClick={() => setActiveTab('A_PAGAR')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'A_PAGAR' ? 'border-[#1F3864] text-[#1F3864]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          A Pagar
        </button>
        <button 
          onClick={() => setActiveTab('A_RECEBER')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'A_RECEBER' ? 'border-[#1F3864] text-[#1F3864]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          A Receber
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'VISAO_GERAL' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                  <TrendingDown className="w-5 h-5 text-red-500" /> Total a Pagar (Pendente)
                </div>
                <div className="text-3xl font-extrabold text-gray-900">{formatCurrency(resumo.totalPagar)}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                  <TrendingUp className="w-5 h-5 text-green-500" /> Total a Receber (Pendente)
                </div>
                <div className="text-3xl font-extrabold text-gray-900">{formatCurrency(resumo.totalReceber)}</div>
              </div>
              <div className="bg-[#1F3864] p-6 rounded-2xl shadow-lg shadow-blue-900/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-blue-100 font-medium text-sm">
                  <DollarSign className="w-5 h-5" /> Saldo Previsto
                </div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(resumo.saldoPrevisto)}</div>
              </div>
            </div>
          )}

          {activeTab === 'A_PAGAR' && renderTable(aPagar, 'SAIDA')}
          
          {activeTab === 'A_RECEBER' && renderTable(aReceber, 'ENTRADA')}
        </>
      )}

      {modalAberto && (
        <TransacaoModal
          onClose={() => setModalAberto(false)}
          onSuccess={() => {
            fetchData();
            setModalAberto(false);
          }}
        />
      )}
    </div>
  );
}
