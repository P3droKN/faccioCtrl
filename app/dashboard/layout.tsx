import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt, logoutAction } from '../actions/auth';
import { Scissors, LogOut, LayoutDashboard, Package, Factory, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import SubscriptionGate from './components/SubscriptionGate';

const prisma = new PrismaClient();

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) redirect('/login');

  let session: any;
  try {
    session = await decrypt(sessionCookie);
  } catch {
    redirect('/login');
  }

  const isPro = session.plano === 'pro';

  // Fetch complete user data to get avatarUrl and config status
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { 
      avatarUrl: true, 
      nome: true,
      configuracaoExpressaStatus: true,
      configuracaoExpressaData: true
    }
  });

  let showExpressBanner = false;
  let expressBannerMessage = '';
  
  if (user?.configuracaoExpressaStatus === 'solicitada' && user.configuracaoExpressaData) {
    showExpressBanner = true;
    const deadline = new Date(user.configuracaoExpressaData.getTime() + 48 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now > deadline) {
      expressBannerMessage = "Estamos finalizando sua Configuração Expressa, entraremos em contato em breve.";
    } else {
      const formattedDeadline = deadline.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      expressBannerMessage = `Sua Configuração Expressa está sendo preparada — prazo até ${formattedDeadline}.`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      {/* Topbar */}
      <header className="sticky top-0 z-30 h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-xl text-[#1F3864]">
          <div className="w-8 h-8 bg-[#1F3864] rounded-lg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          FaccioCtrl
        </Link>

        {/* Nav links */}
        {isPro && (
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#1F3864] hover:bg-blue-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Visão Geral
            </Link>
            <Link
              href="/dashboard/desempenho"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#1F3864] hover:bg-blue-50 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Desempenho
            </Link>
            <Link
              href="/dashboard/faccoes"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#1F3864] hover:bg-blue-50 transition-colors"
            >
              <Factory className="w-4 h-4" />
              Facções
            </Link>
            <Link
              href="/dashboard/ordens"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#1F3864] hover:bg-blue-50 transition-colors"
            >
              <Package className="w-4 h-4" />
              Ordens de Produção
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <Link href="/perfil" className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-sm overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.nome?.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.nome}</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </header>

      {/* Banner de Configuração Expressa */}
      {showExpressBanner && (
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm font-medium shadow-sm flex items-center justify-center gap-2 animate-pulse">
          <span>🚀</span> {expressBannerMessage}
        </div>
      )}

      {/* Page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        {isPro ? children : <SubscriptionGate initialStatus={session.plano} />}
      </main>
    </div>
  );
}
