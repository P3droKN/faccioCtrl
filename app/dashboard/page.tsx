import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '../actions/auth';
import { Package, Factory, TrendingUp, CircleDollarSign, CalendarClock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) redirect('/login');

  let session: any;
  try {
    session = await decrypt(sessionCookie);
  } catch {
    redirect('/login');
  }

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  const userId = Number(session.id);

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { nomeConfeccao: true, nome: true }
  });

  const displayName = dbUser?.nomeConfeccao || dbUser?.nome?.split(' ')[0] || 'Usuário';

  // Buscar dados reais para os indicadores
  const faccoesAtivas = await prisma.faccao.count({ where: { userId, ativo: true } });
  
  const ordens = await prisma.ordem.findMany({
    where: { userId },
    include: { faccao: { select: { nome: true } } }
  });

  const ordensEmAndamento = ordens.filter(o => o.qtdRetornada < o.qtdEnviada);
  const pecasEmProducao = ordensEmAndamento.reduce((acc, o) => acc + (o.qtdEnviada - o.qtdRetornada), 0);

  // Próximas Entregas (Top 5 mais próximas)
  const proximasEntregas = [...ordensEmAndamento]
    .sort((a, b) => new Date(a.prazoAcordado).getTime() - new Date(b.prazoAcordado).getTime())
    .slice(0, 5);

  // Dados financeiros (se ativo)
  let saldoGeral = 0;
  const isFinanceiroAtivo = process.env.NEXT_PUBLIC_FEATURE_FINANCEIRO === 'true';
  if (isFinanceiroAtivo) {
    const transacoes = await prisma.transacaoFinanceira.findMany({ where: { userId } });
    transacoes.forEach(t => {
      saldoGeral += t.tipo === 'ENTRADA' ? Number(t.valor) : -Number(t.valor);
    });
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {displayName}! 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Aqui está o panorama geral do seu negócio.</p>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">Ordens Ativas</h3>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">{ordensEmAndamento.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">Peças em Produção</h3>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">{pecasEmProducao}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">Facções Ativas</h3>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">{faccoesAtivas}</div>
        </div>

        {isFinanceiroAtivo ? (
          <div className="bg-[#1F3864] p-5 rounded-2xl shadow-lg shadow-blue-900/10 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 text-blue-100 rounded-lg">
                <CircleDollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-blue-100">Saldo Geral</h3>
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">{formatCurrency(saldoGeral)}</div>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between opacity-60">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                <CircleDollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-500">Financeiro</h3>
            </div>
            <div className="text-sm font-bold text-gray-400 mt-2">Módulo Inativo</div>
          </div>
        )}
      </div>

      {/* Seção Inferior: Próximas Entregas e Atalhos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Próximas Entregas */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-bold text-gray-900">Próximas Entregas</h2>
            </div>
            <Link href="/dashboard/ordens" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {proximasEntregas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <p className="text-sm">Nenhuma ordem em andamento no momento.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-5 py-3 text-left font-semibold text-gray-500">OP</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-500">Facção</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-500">Prazo</th>
                      <th className="px-5 py-3 text-right font-semibold text-gray-500">Peças Restantes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {proximasEntregas.map(op => {
                      const restantes = op.qtdEnviada - op.qtdRetornada;
                      const prazo = new Date(op.prazoAcordado);
                      const hoje = new Date();
                      hoje.setHours(0,0,0,0);
                      const isAtrasado = prazo < hoje;

                      return (
                        <tr key={op.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-gray-900">{op.numeroOrdem}</td>
                          <td className="px-5 py-3.5 text-gray-600 truncate max-w-[150px]">{op.faccao?.nome}</td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${isAtrasado ? 'bg-red-50 text-red-700' : 'text-gray-600'}`}>
                              {prazo.toLocaleDateString('pt-BR')} {isAtrasado && '(Atrasada)'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-medium text-gray-900">
                            {restantes} <span className="text-gray-400 text-xs font-normal">/ {op.qtdEnviada}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Atalhos Rápidos (Móvel/Complementar) */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Acesso Rápido</h2>
          
          <Link href="/dashboard/desempenho" className="group flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Ver Desempenho</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
          </Link>
          
          <Link href="/dashboard/ordens" className="group flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Package className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Nova Ordem</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link href="/dashboard/faccoes" className="group flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Factory className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Nova Facção</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
          </Link>

        </div>

      </div>
    </div>
  );
}
