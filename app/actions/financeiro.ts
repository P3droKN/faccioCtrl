'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { PrismaClient, TipoTransacao, StatusTransacao } from '@prisma/client';
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

export async function getTransacoes() {
  const userId = await getUserIdFromSession();

  const transacoes = await prisma.transacaoFinanceira.findMany({
    where: { userId },
    orderBy: { dataVencimento: 'asc' },
    include: {
      faccao: {
        select: { id: true, nome: true, codigo: true },
      },
      ordem: {
        select: { id: true, numeroOrdem: true, produto: true },
      }
    },
  });

  return transacoes;
}

export async function getResumoFinanceiro() {
  const userId = await getUserIdFromSession();

  // Basic implementation to sum ENTRADA vs SAIDA pending next 30 days, etc.
  const now = new Date();
  now.setHours(0,0,0,0);
  const in30Days = new Date();
  in30Days.setDate(now.getDate() + 30);

  const transacoes = await prisma.transacaoFinanceira.findMany({
    where: { userId }
  });

  let totalReceber = 0;
  let totalPagar = 0;
  let saldoPrevisto = 0;

  transacoes.forEach(t => {
    const val = Number(t.valor);
    if (t.tipo === 'ENTRADA') {
      if (t.status === 'PENDENTE' || t.status === 'ATRASADO') {
        totalReceber += val;
      }
      saldoPrevisto += val;
    } else {
      if (t.status === 'PENDENTE' || t.status === 'ATRASADO') {
        totalPagar += val;
      }
      saldoPrevisto -= val;
    }
  });

  return { totalReceber, totalPagar, saldoPrevisto };
}

// ─── Criar Lançamento ─────────────────────────────────────────────────────────────

export async function createTransacao(formData: FormData) {
  const userId = await getUserIdFromSession();

  const tipo = formData.get('tipo') as TipoTransacao;
  const categoria = formData.get('categoria') as string;
  const descricao = formData.get('descricao') as string;
  const valorStr = formData.get('valor') as string;
  const dataVencimentoStr = formData.get('dataVencimento') as string;
  const formaPagamento = formData.get('formaPagamento') as string;
  const faccaoIdStr = formData.get('faccaoId') as string;
  
  const valor = parseFloat(valorStr);

  if (!tipo || !categoria || isNaN(valor) || valor <= 0 || !dataVencimentoStr) {
    return { error: 'Preencha os campos obrigatórios corretamente (Valor deve ser maior que 0).' };
  }

  const faccaoId = faccaoIdStr ? parseInt(faccaoIdStr) : null;
  const dataVencimento = new Date(dataVencimentoStr);

  let status: StatusTransacao = 'PENDENTE';
  const today = new Date();
  today.setHours(0,0,0,0);
  if (dataVencimento < today) {
    status = 'ATRASADO';
  }

  try {
    await prisma.transacaoFinanceira.create({
      data: {
        userId,
        tipo,
        categoria,
        descricao: descricao || null,
        valor,
        dataVencimento,
        status,
        formaPagamento: formaPagamento || null,
        faccaoId
      },
    });
  } catch (err) {
    console.error('Erro ao criar transação:', err);
    return { error: 'Erro inesperado ao salvar o lançamento.' };
  }

  revalidatePath('/dashboard/financeiro');
  return { success: true };
}

// ─── Marcar como Pago ─────────────────────────────────────────────────────────

export async function marcarComoPago(id: number) {
  const userId = await getUserIdFromSession();

  const transacao = await prisma.transacaoFinanceira.findFirst({
    where: { id, userId },
  });

  if (!transacao) {
    return { error: 'Transação não encontrada ou sem permissão.' };
  }

  if (transacao.status === 'PAGO') {
    return { error: 'A transação já está paga.' };
  }

  try {
    await prisma.transacaoFinanceira.update({
      where: { id },
      data: {
        status: 'PAGO',
        dataPagamento: new Date()
      },
    });
  } catch (err) {
    console.error('Erro ao atualizar transação:', err);
    return { error: 'Erro inesperado ao atualizar o status.' };
  }

  revalidatePath('/dashboard/financeiro');
  return { success: true };
}
