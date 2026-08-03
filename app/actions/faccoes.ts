'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/actions/auth';

const prisma = new PrismaClient();

// ─── Helpers de sessão ────────────────────────────────────────────────────────

async function getUserIdFromSession(): Promise<number> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) throw new Error('Não autenticado');
  const session = await decrypt(sessionCookie);
  if (!session?.id) throw new Error('Sessão inválida');
  return Number(session.id);
}

// ─── Listagem ─────────────────────────────────────────────────────────────────

export async function getFaccoes() {
  const userId = await getUserIdFromSession();

  const faccoes = await prisma.faccao.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { ordens: true },
      },
    },
  });

  return faccoes;
}

// ─── Criar Facção ─────────────────────────────────────────────────────────────

export async function createFaccao(formData: FormData) {
  const userId = await getUserIdFromSession();

  const codigo = (formData.get('codigo') as string)?.trim();
  const nome = (formData.get('nome') as string)?.trim();
  const contato = (formData.get('contato') as string)?.trim() || null;
  const ativo = formData.get('ativo') === 'true';

  if (!codigo || !nome) {
    return { error: 'Preencha o código e o nome.' };
  }

  try {
    await prisma.faccao.create({
      data: {
        userId,
        codigo,
        nome,
        contato,
        ativo,
      },
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return { error: `O código "${codigo}" já está sendo usado. Escolha outro código.` };
    }
    console.error('Erro ao criar facção:', err);
    return { error: 'Erro inesperado ao salvar a facção.' };
  }

  revalidatePath('/dashboard/faccoes');
  return { success: true };
}

// ─── Atualizar Facção ─────────────────────────────────────────────────────────

export async function updateFaccao(id: number, formData: FormData) {
  const userId = await getUserIdFromSession();

  // Verifica propriedade
  const faccao = await prisma.faccao.findFirst({
    where: { id, userId },
  });
  if (!faccao) {
    return { error: 'Facção não encontrada ou sem permissão.' };
  }

  const codigo = (formData.get('codigo') as string)?.trim();
  const nome = (formData.get('nome') as string)?.trim();
  const contato = (formData.get('contato') as string)?.trim() || null;
  const ativo = formData.get('ativo') === 'true';

  if (!codigo || !nome) {
    return { error: 'Preencha o código e o nome.' };
  }

  try {
    await prisma.faccao.update({
      where: { id },
      data: {
        codigo,
        nome,
        contato,
        ativo,
      },
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return { error: `O código "${codigo}" já está sendo usado por outra facção sua.` };
    }
    console.error('Erro ao atualizar facção:', err);
    return { error: 'Erro inesperado ao atualizar a facção.' };
  }

  revalidatePath('/dashboard/faccoes');
  return { success: true };
}

// ─── Excluir ou Desativar Facção ──────────────────────────────────────────────

export async function deleteFaccao(id: number) {
  const userId = await getUserIdFromSession();

  const faccao = await prisma.faccao.findFirst({
    where: { id, userId },
    include: {
      _count: {
        select: { ordens: true },
      },
    },
  });

  if (!faccao) {
    return { error: 'Facção não encontrada.' };
  }

  if (faccao._count.ordens > 0) {
    // Ao invés de excluir, desativa
    try {
      await prisma.faccao.update({
        where: { id },
        data: { ativo: false },
      });
      revalidatePath('/dashboard/faccoes');
      return { 
        success: true, 
        message: 'A facção possui ordens vinculadas, portanto foi inativada ao invés de excluída.' 
      };
    } catch (err) {
      console.error('Erro ao inativar facção:', err);
      return { error: 'Erro ao desativar a facção.' };
    }
  }

  // Sem ordens, pode excluir
  try {
    await prisma.faccao.delete({
      where: { id },
    });
    revalidatePath('/dashboard/faccoes');
    return { success: true };
  } catch (err) {
    console.error('Erro ao excluir facção:', err);
    return { error: 'Erro ao excluir a facção.' };
  }
}
