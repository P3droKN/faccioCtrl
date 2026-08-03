'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/actions/auth';
import { calcularStatusOP, getPrismaWhereParaStatus, StatusOP } from '@/lib/utils/status-ordem';

const prisma = new PrismaClient();

const PAGE_SIZE = 20;

// ─── Helpers de sessão ────────────────────────────────────────────────────────

async function getUserIdFromSession(): Promise<number> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) throw new Error('Não autenticado');
  const session = await decrypt(sessionCookie);
  if (!session?.id) throw new Error('Sessão inválida');
  return Number(session.id);
}

// ─── Tipos públicos ────────────────────────────────────────────────────────────

export interface OrdemComCalculo {
  id: number;
  numeroOrdem: string;
  produto: string;
  faccaoNome: string;
  faccaoId: number;
  dataEnvio: Date;
  prazoAcordado: Date;
  qtdEnviada: number;
  qtdRetornada: number;
  qtdPendente: number;
  status: StatusOP;
  diasRestantes: number;
  observacao: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetOrdensResult {
  ordens: OrdemComCalculo[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

// ─── Listagem com filtros e paginação ─────────────────────────────────────────

export async function getOrdens(params: {
  busca?: string;
  status?: StatusOP | '';
  page?: number;
}): Promise<GetOrdensResult> {
  const userId = await getUserIdFromSession();
  const page = Math.max(1, params.page ?? 1);
  const busca = params.busca?.trim() ?? '';
  const statusFiltro = params.status || '';

  // Monta o where base — sempre filtrado pelo userId da sessão
  const whereBase: any = { userId };

  if (busca) {
    whereBase.OR = [
      { numeroOrdem: { contains: busca } },
      { produto: { contains: busca } },
    ];
  }

  // Filtro de status: como status é calculado, usamos condições de data
  // combinadas com filtro JS fino para os casos que o Prisma não consegue
  // expressar como comparação entre colunas (CONCLUIDA).
  if (statusFiltro) {
    const prismaWhere = getPrismaWhereParaStatus(statusFiltro as StatusOP);
    Object.assign(whereBase, prismaWhere);
  }

  const [rawOrdens, totalCount] = await Promise.all([
    prisma.ordem.findMany({
      where: whereBase,
      include: { faccao: { select: { id: true, nome: true } } },
      orderBy: { createdAt: 'desc' },
      // Buscamos mais para compensar filtro JS fino em CONCLUIDA
      // Em produção isso pode ser paginação cursor-based; aqui é suficiente.
      take: statusFiltro === 'CONCLUIDA' ? undefined : PAGE_SIZE,
      skip: statusFiltro === 'CONCLUIDA' ? 0 : (page - 1) * PAGE_SIZE,
    }),
    prisma.ordem.count({ where: whereBase }),
  ]);

  const now = new Date();

  // Aplica cálculo de status e filtra com precisão no JS
  let ordensComCalculo: OrdemComCalculo[] = rawOrdens.map((o) => {
    const { status, qtdPendente, diasRestantes } = calcularStatusOP(
      { qtdEnviada: o.qtdEnviada, qtdRetornada: o.qtdRetornada, prazoAcordado: o.prazoAcordado },
      now
    );
    return {
      id: o.id,
      numeroOrdem: o.numeroOrdem,
      produto: o.produto,
      faccaoNome: o.faccao.nome,
      faccaoId: o.faccao.id,
      dataEnvio: o.dataEnvio,
      prazoAcordado: o.prazoAcordado,
      qtdEnviada: o.qtdEnviada,
      qtdRetornada: o.qtdRetornada,
      qtdPendente,
      status,
      diasRestantes,
      observacao: o.observacao,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };
  });

  // Filtro fino por status (resolve limitação do Prisma para CONCLUIDA)
  if (statusFiltro) {
    ordensComCalculo = ordensComCalculo.filter((o) => o.status === statusFiltro);
  }

  // Para CONCLUIDA, aplica paginação manual após filtro JS
  let paginada = ordensComCalculo;
  let total = totalCount;
  if (statusFiltro === 'CONCLUIDA') {
    total = ordensComCalculo.length;
    paginada = ordensComCalculo.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }

  return {
    ordens: paginada,
    totalCount: total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    currentPage: page,
  };
}

// ─── Criar Ordem ──────────────────────────────────────────────────────────────

export async function createOrdem(formData: FormData) {
  const userId = await getUserIdFromSession();

  const numeroOrdem = (formData.get('numeroOrdem') as string)?.trim();
  const produto = (formData.get('produto') as string)?.trim();
  const faccaoId = Number(formData.get('faccaoId'));
  const dataEnvio = formData.get('dataEnvio') as string;
  const prazoAcordado = formData.get('prazoAcordado') as string;
  const qtdEnviada = Number(formData.get('qtdEnviada'));
  const observacao = (formData.get('observacao') as string)?.trim() || null;

  // Validações
  if (!numeroOrdem || !produto || !faccaoId || !dataEnvio || !prazoAcordado || !qtdEnviada) {
    return { error: 'Preencha todos os campos obrigatórios.' };
  }
  if (qtdEnviada < 1) {
    return { error: 'Quantidade enviada deve ser maior que zero.' };
  }

  const dtEnvio = new Date(dataEnvio);
  const dtPrazo = new Date(prazoAcordado);
  if (dtPrazo <= dtEnvio) {
    return { error: 'O prazo acordado deve ser posterior à data de envio.' };
  }

  // Verifica que a facção pertence ao usuário logado (não confia em id do client)
  const faccaoDoUsuario = await prisma.faccao.findFirst({
    where: { id: faccaoId, userId },
  });
  if (!faccaoDoUsuario) {
    return { error: 'Facção inválida ou não pertence ao seu cadastro.' };
  }

  try {
    await prisma.ordem.create({
      data: {
        userId,
        numeroOrdem,
        produto,
        faccaoId,
        dataEnvio: dtEnvio,
        prazoAcordado: dtPrazo,
        qtdEnviada,
        qtdRetornada: 0,
        observacao,
      },
    });
  } catch (err: any) {
    // P2002 = violação de unique constraint (numeroOrdem duplicado para o usuário)
    if (err.code === 'P2002') {
      return { error: `Você já possui uma ordem com o número "${numeroOrdem}". Use um número diferente.` };
    }
    console.error('Erro ao criar ordem:', err);
    return { error: 'Erro inesperado ao salvar a ordem. Tente novamente.' };
  }

  revalidatePath('/dashboard/ordens');
  return { success: true };
}

// ─── Editar Ordem (apenas qtdRetornada e observacao) ─────────────────────────

export async function updateOrdem(ordemId: number, formData: FormData) {
  const userId = await getUserIdFromSession();

  // Busca a ordem verificando a propriedade pelo userId da sessão
  const ordem = await prisma.ordem.findFirst({
    where: { id: ordemId, userId },
  });
  if (!ordem) {
    return { error: 'Ordem não encontrada ou sem permissão para editar.' };
  }

  const qtdRetornada = Number(formData.get('qtdRetornada'));
  const observacao = (formData.get('observacao') as string)?.trim() || null;

  // Validações
  if (isNaN(qtdRetornada) || qtdRetornada < 0) {
    return { error: 'Quantidade retornada não pode ser negativa.' };
  }
  if (qtdRetornada > ordem.qtdEnviada) {
    return {
      error: `Quantidade retornada (${qtdRetornada}) não pode ser maior que a quantidade enviada (${ordem.qtdEnviada}).`,
    };
  }

  try {
    await prisma.ordem.update({
      where: { id: ordemId },
      data: { qtdRetornada, observacao },
    });
  } catch (err: any) {
    console.error('Erro ao atualizar ordem:', err);
    return { error: 'Erro inesperado ao atualizar a ordem. Tente novamente.' };
  }

  revalidatePath('/dashboard/ordens');
  return { success: true };
}

// ─── Listar facções do usuário para o Select ──────────────────────────────────

export async function getFaccoesOptions() {
  const userId = await getUserIdFromSession();

  const faccoes = await prisma.faccao.findMany({
    where: { userId, ativo: true },
    select: { id: true, nome: true },
    orderBy: { nome: 'asc' },
  });

  return faccoes;
}

// ─── Excluir Ordem ────────────────────────────────────────────────────────────

export async function deleteOrdem(ordemId: number) {
  const userId = await getUserIdFromSession();

  // Verifica propriedade
  const ordem = await prisma.ordem.findFirst({
    where: { id: ordemId, userId },
  });
  if (!ordem) {
    return { error: 'Ordem não encontrada ou sem permissão para excluir.' };
  }

  try {
    await prisma.ordem.delete({
      where: { id: ordemId },
    });
  } catch (err: any) {
    console.error('Erro ao excluir ordem:', err);
    return { error: 'Erro inesperado ao excluir a ordem. Tente novamente.' };
  }

  revalidatePath('/dashboard/ordens');
  return { success: true };
}

