import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt, logoutAction } from '../actions/auth';
import { Scissors, LogOut, LayoutDashboard, Package, Factory, TrendingUp, ShieldAlert, FileText, Users, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import SubscriptionGate from './components/SubscriptionGate';

const prisma = new PrismaClient();

const navigation = [
  { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Desempenho', href: '/dashboard/desempenho', icon: TrendingUp },
  { name: 'Facções', href: '/dashboard/faccoes', icon: Factory },
  { name: 'Ordens de Produção', href: '/dashboard/ordens', icon: Package },
  { name: 'Auditoria', href: '/dashboard/auditoria', icon: ShieldAlert },
];

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
      configuracaoExpressaData: true,
      mentoria30DiasStatus: true,
      mentoria30DiasCheckins: true,
      moduloAuditoria: true
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

  const showMentoriaBanner = user?.mentoria30DiasStatus === 'ativa';
  const mentoriaCheckins = user?.mentoria30DiasCheckins || 0;

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
            <Link
              href="/dashboard/auditoria"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#1F3864] hover:bg-blue-50 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              Auditoria {user?.moduloAuditoria ? '' : '🔒'}
            </Link>
            {process.env.NEXT_PUBLIC_FEATURE_FINANCEIRO === 'true' && (
              <Link
                href="/dashboard/financeiro"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#1F3864] hover:bg-blue-50 transition-colors"
              >
                <CircleDollarSign className="w-4 h-4" />
                Financeiro
              </Link>
            )}
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

      {/* Banner de Mentoria 30 Dias */}
      {showMentoriaBanner && (
        <div className="bg-green-600 text-white px-4 py-3 text-center text-sm font-medium shadow-sm flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span>🎓</span> Sua Mentoria de 30 Dias está ativa — check-in {mentoriaCheckins} de 4 realizados.
          </div>
          <a 
            href={process.env.TELEGRAM_LINK || "https://t.me/"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-green-700 px-3 py-1 rounded shadow-sm hover:bg-green-50 transition-colors font-bold whitespace-nowrap"
          >
            Acessar Telegram
          </a>
        </div>
      )}

      {/* Page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 pb-24 md:pb-10">
        {isPro ? children : <SubscriptionGate initialStatus={session.plano} />}
      </main>

      {/* Mobile Bottom Navigation */}
      {isPro && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around items-center h-16 px-2 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link href="/dashboard" className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-[#1F3864]">
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Início</span>
          </Link>
          <Link href="/dashboard/desempenho" className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-[#1F3864]">
            <TrendingUp className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Desempenho</span>
          </Link>
          <Link href="/dashboard/faccoes" className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-[#1F3864]">
            <Factory className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Facções</span>
          </Link>
          <Link href="/dashboard/ordens" className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-[#1F3864]">
            <Package className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Ordens</span>
          </Link>
          <Link href="/dashboard/auditoria" className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-[#1F3864]">
            <ShieldAlert className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium truncate max-w-[60px]">Auditoria</span>
          </Link>
          {process.env.NEXT_PUBLIC_FEATURE_FINANCEIRO === 'true' && (
            <Link href="/dashboard/financeiro" className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-[#1F3864]">
              <CircleDollarSign className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Finanças</span>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
