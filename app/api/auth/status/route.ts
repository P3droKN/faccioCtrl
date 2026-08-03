import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { decrypt, encrypt } from '@/app/actions/auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    if (!session?.id) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
    }

    // Consulta o plano atual diretamente do banco de dados (que pode ter sido atualizado pelo webhook)
    const user = await prisma.user.findUnique({
      where: { id: Number(session.id) },
      select: { plano: true, nome: true, id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Se o plano no banco for diferente do que está no JWT, atualiza o JWT!
    if (user.plano !== session.plano) {
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const newSession = await encrypt({ id: user.id, nome: user.nome, plano: user.plano });
      cookieStore.set('session', newSession, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    }

    return NextResponse.json({ plano: user.plano });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
