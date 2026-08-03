import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '../actions/auth';
import { Package, Factory, TrendingUp } from 'lucide-react';
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
  const dbUser = await prisma.user.findUnique({
    where: { id: Number(session.id) },
    select: { nomeConfeccao: true, nome: true }
  });

  const displayName = dbUser?.nomeConfeccao || dbUser?.nome?.split(' ')[0] || 'Usuário';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {displayName}! 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Aqui está o resumo do seu painel de controle.</p>
      </div>

      {/* Quick access cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/dashboard/desempenho"
          className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Novo
            </span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Desempenho</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Acompanhe métricas, ranking de atrasos e indicadores das suas facções.
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600">
            Acessar
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <Link
          href="/dashboard/faccoes"
          className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Factory className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Ativo
            </span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Facções</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Cadastre e gerencie suas oficinas de costura parceiras.
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600">
            Acessar
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <Link
          href="/dashboard/ordens"
          className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Ativo
            </span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Ordens de Produção</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Gerencie e acompanhe o andamento de todas as suas OPs em tempo real.
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600">
            Acessar
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
