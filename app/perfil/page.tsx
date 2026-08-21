import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '../actions/auth';
import PerfilTabs from './PerfilTabs';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) redirect('/login');

  let session;
  try {
    session = await decrypt(sessionCookie);
  } catch {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard" className="md:hidden inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 -ml-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1F3864]">Meu Perfil</h1>
        <p className="text-gray-500 mt-1">Gerencie seus dados, segurança e plano.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <PerfilTabs user={user} />
      </div>

      <div className="text-center mt-12 pb-6">
        <p className="text-sm text-gray-400">Precisa de ajuda? Fale com a gente</p>
        <a 
          href="mailto:suporteplataforma.pkn@gmail.com" 
          className="text-sm text-gray-500 hover:text-blue-500 hover:underline transition-colors mt-1 inline-block"
        >
          suporteplataforma.pkn@gmail.com
        </a>
      </div>
    </div>
  );
}
