'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { Plus, Factory, Pencil, Trash2, PowerOff, Loader2, ChevronLeft } from 'lucide-react';
import { getFaccoes, deleteFaccao } from '@/app/actions/faccoes';
import { FaccaoModal } from './components/FaccaoModal';
import Link from 'next/link';

interface Faccao {
  id: number;
  codigo: string;
  nome: string;
  contato: string | null;
  ativo: boolean;
  _count?: { ordens: number };
}

export default function FaccoesPage() {
  const [faccoes, setFaccoes] = useState<Faccao[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modal, setModal] = useState<{ aberto: boolean; modo: 'criar' | 'editar'; faccao?: Faccao }>({
    aberto: false,
    modo: 'criar',
  });
  
  const [isPending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<number | null>(null);

  const fetchFaccoes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFaccoes();
      setFaccoes(result as any);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaccoes();
  }, [fetchFaccoes]);

  function abrirModalCriar() {
    setModal({ aberto: true, modo: 'criar' });
  }

  function abrirModalEditar(faccao: Faccao) {
    setModal({ aberto: true, modo: 'editar', faccao });
  }

  function fecharModal() {
    setModal({ aberto: false, modo: 'criar' });
  }

  function handleSuccess() {
    startTransition(() => {
      fetchFaccoes();
    });
  }

  function handleExcluirOuDesativar(faccao: Faccao) {
    const isExcluir = faccao._count?.ordens === 0;
    const acaoTexto = isExcluir ? 'excluir' : 'inativar';
    
    if (!confirm(`Tem certeza que deseja ${acaoTexto} a facção ${faccao.nome}?`)) return;

    setActionId(faccao.id);
    startTransition(async () => {
      const result = await deleteFaccao(faccao.id);
      if (result.error) {
        alert(result.error);
      }
      
      // Mesmo se retornou uma "success" message (informando que inativou em vez de excluir), 
      // mostramos o alert com essa informação para o usuário entender o que ocorreu.
      if (result.message) {
        alert(result.message);
      }
      
      await fetchFaccoes();
      setActionId(null);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="md:hidden inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 -ml-1 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Facções</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {faccoes.length === 0
              ? 'Nenhuma facção cadastrada'
              : `${faccoes.length} facç${faccoes.length !== 1 ? 'ões' : 'ão'} encontrada${faccoes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={abrirModalCriar}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1F3864] hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Nova Facção
        </button>
      </div>

      {/* Tabela / Estado Vazio */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : faccoes.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <Factory className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Cadastre sua primeira facção
            </h3>
            <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
              Adicione as oficinas de costura parceiras para começar a vincular ordens de produção.
            </p>
            <button
              onClick={abrirModalCriar}
              className="flex items-center gap-2 px-6 py-3 bg-[#1F3864] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Criar primeira Facção
            </button>
          </div>
        ) : (
          /* Tabela */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {['Código', 'Nome', 'Contato', 'Status', 'Ordens', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {faccoes.map((f) => (
                  <tr key={f.id} className={`hover:bg-gray-50/60 transition-colors group ${!f.ativo ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                      {f.codigo}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Factory className="w-4 h-4 text-gray-400" />
                        {f.nome}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {f.contato || '—'}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          f.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${f.ativo ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {f.ativo ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {f._count?.ordens} OP{f._count?.ordens !== 1 ? 's' : ''}
                    </td>
                    <td className="px-2 sm:px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => abrirModalEditar(f)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleExcluirOuDesativar(f)}
                          disabled={actionId === f.id}
                          className={`p-2 rounded-lg transition-colors ${
                            f._count?.ordens === 0
                              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={f._count?.ordens === 0 ? 'Excluir Facção' : 'Inativar Facção'}
                        >
                          {actionId === f.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : f._count?.ordens === 0 ? (
                            <Trash2 className="w-4 h-4" />
                          ) : (
                            <PowerOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.aberto && (
        <FaccaoModal
          modo={modal.modo}
          faccao={modal.faccao}
          onClose={fecharModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
