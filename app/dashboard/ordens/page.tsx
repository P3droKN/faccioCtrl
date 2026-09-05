'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import {
  Plus,
  Search,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Scissors,
  Trash2,
  Printer,
} from 'lucide-react';
import Link from 'next/link';
import { getOrdens, getFaccoesOptions, deleteOrdem } from '@/app/actions/ordens';
import type { OrdemComCalculo } from '@/app/actions/ordens';
import { STATUS_LABEL, STATUS_COLOR, STATUS_DOT, StatusOP } from '@/lib/utils/status-ordem';
import { OrdemModal } from './components/OrdemModal';

const STATUS_OPTIONS: { value: StatusOP | ''; label: string }[] = [
  { value: '', label: 'Todos os Status' },
  { value: 'NO_PRAZO', label: 'No Prazo' },
  { value: 'EM_RISCO', label: 'Em Risco' },
  { value: 'ATRASADA', label: 'Atrasada' },
  { value: 'CONCLUIDA', label: 'Concluída' },
];

export default function OrdensPage() {
  const [ordens, setOrdens] = useState<OrdemComCalculo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<StatusOP | ''>('');
  const [modal, setModal] = useState<{ aberto: boolean; modo: 'criar' | 'editar'; ordem?: OrdemComCalculo }>({
    aberto: false,
    modo: 'criar',
  });
  const [deleteModal, setDeleteModal] = useState<{ aberto: boolean; ordem?: OrdemComCalculo }>({
    aberto: false,
  });
  const [faccoes, setFaccoes] = useState<{ id: number; nome: string }[]>([]);
  const [, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrdens = useCallback(
    async (page = currentPage) => {
      setLoading(true);
      try {
        const result = await getOrdens({ busca, status: statusFiltro, page });
        setOrdens(result.ordens);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        setCurrentPage(result.currentPage);
      } finally {
        setLoading(false);
      }
    },
    [busca, statusFiltro, currentPage]
  );

  // Busca inicial e quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [busca, statusFiltro]);

  useEffect(() => {
    fetchOrdens(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, statusFiltro, currentPage]);

  // Carrega facções para o modal de criação
  useEffect(() => {
    getFaccoesOptions().then(setFaccoes);
  }, []);

  function abrirModalCriar() {
    setModal({ aberto: true, modo: 'criar' });
  }

  function abrirModalEditar(ordem: OrdemComCalculo) {
    setModal({ aberto: true, modo: 'editar', ordem });
  }

  function fecharModal() {
    setModal({ aberto: false, modo: 'criar' });
  }

  function abrirModalExcluir(ordem: OrdemComCalculo) {
    setDeleteModal({ aberto: true, ordem });
  }

  function fecharModalExcluir() {
    setDeleteModal({ aberto: false });
  }

  function handleSuccess() {
    startTransition(() => {
      fetchOrdens(currentPage);
    });
  }

  async function confirmarExclusao() {
    if (!deleteModal.ordem) return;
    setIsDeleting(true);
    try {
      const res = await deleteOrdem(deleteModal.ordem.id);
      if (res.error) {
        alert(res.error);
      } else {
        fetchOrdens(currentPage);
      }
    } finally {
      setIsDeleting(false);
      fecharModalExcluir();
    }
  }

  // Busca com debounce simples
  const [buscaInput, setBuscaInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setBusca(buscaInput), 400);
    return () => clearTimeout(t);
  }, [buscaInput]);

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="md:hidden inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 -ml-1 transition-colors print:hidden">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Ordens de Produção</h1>
          <p className="text-sm text-gray-500 mt-0.5 print:hidden">
            {totalCount === 0
              ? 'Nenhuma ordem cadastrada'
              : `${totalCount} ordem${totalCount !== 1 ? 's' : ''} encontrada${totalCount !== 1 ? 's' : ''}`}
          </p>
          <p className="hidden print:block text-sm text-gray-500 mt-0.5">
            Visão Geral das Operações
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all shadow-sm"
            title="Imprimir Tabela"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={abrirModalCriar}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1F3864] hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Nova Ordem
          </button>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por Nº Ordem ou Produto..."
            value={buscaInput}
            onChange={(e) => setBuscaInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value as StatusOP | '')}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela / Estado Vazio */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : ordens.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {busca || statusFiltro
                ? 'Nenhuma ordem encontrada'
                : 'Crie sua primeira Ordem de Produção'}
            </h3>
            <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
              {busca || statusFiltro
                ? 'Tente ajustar os filtros ou o termo de busca.'
                : 'Comece cadastrando uma ordem para acompanhar o andamento das suas facções em tempo real.'}
            </p>
            {!busca && !statusFiltro && (
              <button
                onClick={abrirModalCriar}
                className="flex items-center gap-2 px-6 py-3 bg-[#1F3864] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Criar primeira OP
              </button>
            )}
          </div>
        ) : (
          /* Tabela */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Nº Ordem</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Produto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Facção</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Envio</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Prazo</th>
                  <th className="hidden md:table-cell px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Enviado</th>
                  <th className="hidden md:table-cell px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Retornado</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Pendente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
                  <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Obs.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ordens.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                      #{o.numeroOrdem}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3.5 text-gray-700 font-medium whitespace-nowrap">
                      {o.produto}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[100px] sm:max-w-none">{o.faccaoNome}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {new Date(o.dataEnvio).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          o.status === 'ATRASADA'
                            ? 'text-red-600'
                            : o.status === 'EM_RISCO'
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {new Date(o.prazoAcordado).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3.5 text-gray-700 font-medium text-center">{o.qtdEnviada}</td>
                    <td className="hidden md:table-cell px-4 py-3.5 text-gray-700 font-medium text-center">{o.qtdRetornada}</td>
                    <td className="hidden sm:table-cell px-4 py-3.5 font-bold text-gray-900 text-center">{o.qtdPendente}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLOR[o.status]}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status]} hidden sm:block`} />
                        <span className="truncate max-w-[70px] sm:max-w-none">{STATUS_LABEL[o.status]}</span>
                      </span>
                    </td>
                    <td className="hidden xl:table-cell px-4 py-3.5 text-gray-400 max-w-[140px] truncate" title={o.observacao ?? ''}>
                      {o.observacao || '—'}
                    </td>
                    <td className="px-2 sm:px-4 py-3.5 print:hidden">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/ordens/${o.id}/imprimir`}
                          target="_blank"
                          className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-[#1F3864] hover:bg-blue-50 transition-colors"
                          title="Imprimir Ficha"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => abrirModalEditar(o)}
                          className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => abrirModalExcluir(o)}
                          className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Paginação */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm print:hidden">
          <p className="text-gray-500">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.aberto && (
        <OrdemModal
          modo={modal.modo}
          faccoes={faccoes}
          ordem={modal.ordem}
          onClose={fecharModal}
          onSuccess={handleSuccess}
        />
      )}

      {/* Modal de Exclusão */}
      {deleteModal.aberto && deleteModal.ordem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Ordem?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja excluir a OP #{deleteModal.ordem.numeroOrdem}? Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={fecharModalExcluir}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-60 flex items-center justify-center"
              >
                {isDeleting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
