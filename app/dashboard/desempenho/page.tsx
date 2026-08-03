'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Factory, Calendar, TrendingUp, AlertTriangle, CheckCircle, Package, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { getDesempenhoFaccoes, type Período, type FaccaoMetricas, type DesempenhoData } from '@/app/actions/desempenho';

type SortColumn = 'codigo' | 'nome' | 'totalOrdens' | 'ordensConcluidas' | 'ordensAtrasadas' | 'ordensEmAndamento' | 'totalPecasEnviadas' | 'percentualAtraso';

function formatPercent(val: number | null) {
  if (val === null) return '—';
  return `${val.toFixed(1)}%`;
}

function getAtrasoColorClasses(val: number | null, isChart = false) {
  if (val === null) {
    return isChart ? 'bg-gray-200' : 'bg-gray-100 text-gray-500';
  }
  if (val === 0) {
    return isChart ? 'bg-green-500' : 'bg-green-100 text-green-700';
  }
  if (val <= 30) {
    return isChart ? 'bg-yellow-400' : 'bg-yellow-100 text-yellow-700';
  }
  return isChart ? 'bg-red-500' : 'bg-red-100 text-red-700';
}

export default function DesempenhoPage() {
  const [periodo, setPeriodo] = useState<Período>('tudo');
  const [data, setData] = useState<DesempenhoData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Ordenação
  const [sortColumn, setSortColumn] = useState<SortColumn>('percentualAtraso');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLoading(true);
    startTransition(async () => {
      const result = await getDesempenhoFaccoes(periodo);
      setData(result);
      setLoading(false);
    });
  }, [periodo]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (data?.emptyFaccoes) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center justify-center py-32 px-6 text-center mt-6">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
          <TrendingUp className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Cadastre sua primeira facção para começar a acompanhar o desempenho
        </h3>
        <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
          O painel de desempenho exibe análises agregadas e gráficos a partir do histórico de ordens das suas oficinas.
        </p>
        <Link
          href="/dashboard/faccoes"
          className="flex items-center gap-2 px-6 py-3 bg-[#1F3864] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all hover:-translate-y-0.5"
        >
          <Factory className="w-4 h-4" />
          Ir para Facções
        </Link>
      </div>
    );
  }

  // --- PREPARAÇÃO DO GRÁFICO (Chart) ---
  const faccoesChart = data?.faccoes
    .filter((f) => f.percentualAtraso !== null) // Exclui quem não tem ordens
    .sort((a, b) => (a.percentualAtraso || 0) - (b.percentualAtraso || 0)); // Menor atraso primeiro

  // --- LÓGICA DE ORDENAÇÃO DA TABELA ---
  function toggleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  const sortedFaccoes = data ? [...data.faccoes].sort((a, b) => {
    // Regra rígida: facções com Total de Ordens = 0 ficam SEMPRE no fim da lista
    if (a.totalOrdens === 0 && b.totalOrdens > 0) return 1;
    if (b.totalOrdens === 0 && a.totalOrdens > 0) return -1;
    if (a.totalOrdens === 0 && b.totalOrdens === 0) return 0;

    let aValue: any = a[sortColumn];
    let bValue: any = b[sortColumn];

    if (sortColumn === 'percentualAtraso') {
      aValue = a.percentualAtraso ?? 0;
      bValue = b.percentualAtraso ?? 0;
    } else if (sortColumn === 'nome' || sortColumn === 'codigo') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }) : [];

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER + FILTRO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Desempenho</h1>
          <p className="text-sm text-gray-500 mt-0.5">Métricas e acompanhamento das suas facções</p>
        </div>
        
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as Período)}
            disabled={isPending}
            className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <option value="30_dias">Últimos 30 dias</option>
            <option value="90_dias">Últimos 90 dias</option>
            <option value="tudo">Desde o início</option>
          </select>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total OPs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Total de Ordens</p>
              <h4 className="text-3xl font-extrabold text-gray-900">{data?.kpis.totalOrdens}</h4>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Concluídas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Concluídas</p>
              <h4 className="text-3xl font-extrabold text-gray-900">{data?.kpis.ordensConcluidas}</h4>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Atrasadas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Atrasadas</p>
              <h4 className="text-3xl font-extrabold text-gray-900">{data?.kpis.ordensAtrasadas}</h4>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>

        {/* % Atraso Médio */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">% de Atraso Médio</p>
              <h4 className="text-3xl font-extrabold text-gray-900">
                {formatPercent(data?.kpis.percentualAtrasoMedio ?? null)}
              </h4>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              data?.kpis.percentualAtrasoMedio === null ? 'bg-gray-50' : 
              data?.kpis.percentualAtrasoMedio === 0 ? 'bg-green-50' : 
              data!.kpis.percentualAtrasoMedio <= 30 ? 'bg-yellow-50' : 'bg-red-50'
            }`}>
              <TrendingUp className={`w-5 h-5 ${
                data?.kpis.percentualAtrasoMedio === null ? 'text-gray-400' : 
                data?.kpis.percentualAtrasoMedio === 0 ? 'text-green-500' : 
                data!.kpis.percentualAtrasoMedio <= 30 ? 'text-yellow-500' : 'text-red-500'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICO COMPARATIVO */}
      {faccoesChart && faccoesChart.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Ranking: Menor % de Atraso</h3>
            <p className="text-sm text-gray-500 mt-1">Comparativo de atrasos entre facções (apenas facções com ordens no período)</p>
          </div>
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {faccoesChart.map(f => {
              // Garante uma largura visual mínima se for 0%
              const widthStr = f.percentualAtraso === 0 ? '4px' : `${f.percentualAtraso}%`;
              
              return (
                <div key={f.id} className="relative group">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-1.5 px-0.5">
                    <span className="truncate pr-4">{f.nome}</span>
                    <span>{formatPercent(f.percentualAtraso)}</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${getAtrasoColorClasses(f.percentualAtraso, true)}`}
                      style={{ width: widthStr }}
                    />
                  </div>

                  {/* Tooltip CSS puro */}
                  <div className="absolute left-1/2 -top-10 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-max max-w-[200px]">
                    <div className="bg-gray-900 text-white text-xs p-2 rounded-lg shadow-xl">
                      <p className="font-bold mb-1 truncate">{f.nome}</p>
                      <p className="text-gray-300">Total OPs: <span className="text-white font-medium">{f.totalOrdens}</span></p>
                      <p className="text-gray-300">Atrasadas: <span className="text-white font-medium">{f.ordensAtrasadas}</span></p>
                      <p className="text-gray-300 mt-1">% Atraso: <span className="text-white font-medium">{formatPercent(f.percentualAtraso)}</span></p>
                    </div>
                    {/* Seta do tooltip */}
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TABELA DETALHADA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th onClick={() => toggleSort('codigo')} className="group px-4 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center gap-2">Código <SortIcon column="codigo" /></div>
                </th>
                <th onClick={() => toggleSort('nome')} className="group px-4 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center gap-2">Facção <SortIcon column="nome" /></div>
                </th>
                <th onClick={() => toggleSort('totalOrdens')} className="group px-4 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">Total Ordens <SortIcon column="totalOrdens" /></div>
                </th>
                <th onClick={() => toggleSort('ordensConcluidas')} className="group px-4 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">Concluídas <SortIcon column="ordensConcluidas" /></div>
                </th>
                <th onClick={() => toggleSort('ordensAtrasadas')} className="group px-4 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">Atrasadas <SortIcon column="ordensAtrasadas" /></div>
                </th>
                <th onClick={() => toggleSort('ordensEmAndamento')} className="group px-4 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">Em Andamento <SortIcon column="ordensEmAndamento" /></div>
                </th>
                <th onClick={() => toggleSort('totalPecasEnviadas')} className="group px-4 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">Total Peças <SortIcon column="totalPecasEnviadas" /></div>
                </th>
                <th onClick={() => toggleSort('percentualAtraso')} className="group px-4 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">% Atraso <SortIcon column="percentualAtraso" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedFaccoes.map((f) => (
                <tr key={f.id} className={`hover:bg-gray-50/60 transition-colors ${f.totalOrdens === 0 ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap">{f.codigo}</td>
                  <td className="px-4 py-4 text-gray-700 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Factory className="w-4 h-4 text-gray-400" />
                      {f.nome}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-gray-900">{f.totalOrdens}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{f.ordensConcluidas}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{f.ordensAtrasadas}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{f.ordensEmAndamento}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{f.totalPecasEnviadas}</td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getAtrasoColorClasses(f.percentualAtraso)}`}
                    >
                      {formatPercent(f.percentualAtraso)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
