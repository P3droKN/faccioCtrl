'use server';

import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/actions/auth';
import { calcularStatusOP } from '@/lib/utils/status-ordem';

const prisma = new PrismaClient();

async function getUserIdFromSession(): Promise<number> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) throw new Error('Não autenticado');
  const session = await decrypt(sessionCookie);
  if (!session?.id) throw new Error('Sessão inválida');
  return Number(session.id);
}

export type Período = '30_dias' | '90_dias' | 'tudo';

export interface FaccaoMetricas {
  id: number;
  codigo: string;
  nome: string;
  totalOrdens: number;
  ordensConcluidas: number;
  ordensAtrasadas: number;
  ordensEmAndamento: number;
  totalPecasEnviadas: number;
  percentualAtraso: number | null; // null representa "—" (sem ordens)
}

export interface DesempenhoData {
  emptyFaccoes: boolean;
  kpis: {
    totalOrdens: number;
    ordensConcluidas: number;
    ordensAtrasadas: number;
    percentualAtrasoMedio: number | null;
  };
  faccoes: FaccaoMetricas[];
}

export async function getDesempenhoFaccoes(periodo: Período = 'tudo'): Promise<DesempenhoData> {
  // PONTO 1 DE SEGURANÇA: userId extraído exclusivamente da sessão JWT
  const userId = await getUserIdFromSession();

  // 1. Busca todas as Facções do usuário logado
  const faccoes = await prisma.faccao.findMany({
    where: { userId },
  });

  if (faccoes.length === 0) {
    return {
      emptyFaccoes: true,
      kpis: {
        totalOrdens: 0,
        ordensConcluidas: 0,
        ordensAtrasadas: 0,
        percentualAtrasoMedio: null,
      },
      faccoes: [],
    };
  }

  // 2. Determina o filtro de data baseado no período (aplicado a dataEnvio)
  let dateFilter = {};
  if (periodo !== 'tudo') {
    const days = periodo === '30_dias' ? 30 : 90;
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);
    dateFilter = {
      dataEnvio: {
        gte: pastDate,
      },
    };
  }

  // 3. Busca todas as Ordens do usuário dentro do filtro
  const ordens = await prisma.ordem.findMany({
    where: {
      userId,
      ...dateFilter,
    },
  });

  // 4. Agrupa e calcula as métricas por facção (em memória)
  // Inicializamos o mapa com todas as facções do usuário
  const mapFaccoes = new Map<number, FaccaoMetricas>();
  
  for (const faccao of faccoes) {
    mapFaccoes.set(faccao.id, {
      id: faccao.id,
      codigo: faccao.codigo,
      nome: faccao.nome,
      totalOrdens: 0,
      ordensConcluidas: 0,
      ordensAtrasadas: 0,
      ordensEmAndamento: 0,
      totalPecasEnviadas: 0,
      percentualAtraso: null, // default para facções que vão ficar com 0 ordens
    });
  }

  // Acumuladores Globais
  let globalTotalOrdens = 0;
  let globalOrdensConcluidas = 0;
  let globalOrdensAtrasadas = 0;

  for (const ordem of ordens) {
    const stats = mapFaccoes.get(ordem.faccaoId);
    if (!stats) continue; // Caso raro (ex: ordem de uma facção deletada hard-delete, mas não fazemos isso)

    const { status } = calcularStatusOP({
      qtdEnviada: ordem.qtdEnviada,
      qtdRetornada: ordem.qtdRetornada,
      prazoAcordado: ordem.prazoAcordado,
    });

    stats.totalOrdens++;
    stats.totalPecasEnviadas += ordem.qtdEnviada;

    globalTotalOrdens++;

    if (status === 'CONCLUIDA') {
      stats.ordensConcluidas++;
      globalOrdensConcluidas++;
    } else if (status === 'ATRASADA') {
      stats.ordensAtrasadas++;
      globalOrdensAtrasadas++;
    } else if (status === 'NO_PRAZO' || status === 'EM_RISCO') {
      stats.ordensEmAndamento++;
    }
  }

  // 5. Finaliza o cálculo dos percentuais individuais por facção
  for (const stats of mapFaccoes.values()) {
    if (stats.totalOrdens > 0) {
      stats.percentualAtraso = (stats.ordensAtrasadas / stats.totalOrdens) * 100;
    }
  }

  // 6. PONTO 2: Cálculo PONDERADO do percentual de atraso médio global
  // Soma de Ordens Atrasadas de TODAS as facções / Soma de Total de Ordens de TODAS as facções
  const globalPercentualAtrasoMedio =
    globalTotalOrdens > 0
      ? (globalOrdensAtrasadas / globalTotalOrdens) * 100
      : null;

  return {
    emptyFaccoes: false,
    kpis: {
      totalOrdens: globalTotalOrdens,
      ordensConcluidas: globalOrdensConcluidas,
      ordensAtrasadas: globalOrdensAtrasadas,
      percentualAtrasoMedio: globalPercentualAtrasoMedio,
    },
    faccoes: Array.from(mapFaccoes.values()),
  };
}
