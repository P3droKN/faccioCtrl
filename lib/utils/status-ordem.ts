/**
 * Cálculo de Status e Qtd Pendente de Ordens de Produção.
 * Função compartilhada entre backend (filtros server-side) e frontend (exibição).
 *
 * A ordem de avaliação abaixo é RIGOROSA — a primeira condição verdadeira define o resultado.
 */

export type StatusOP = 'CONCLUIDA' | 'ATRASADA' | 'EM_RISCO' | 'NO_PRAZO';

export const STATUS_LABEL: Record<StatusOP, string> = {
  CONCLUIDA: 'Concluída',
  ATRASADA: 'Atrasada',
  EM_RISCO: 'Em Risco',
  NO_PRAZO: 'No Prazo',
};

export const STATUS_COLOR: Record<StatusOP, string> = {
  CONCLUIDA: 'bg-blue-100 text-blue-700',
  ATRASADA: 'bg-red-100 text-red-700',
  EM_RISCO: 'bg-yellow-100 text-yellow-700',
  NO_PRAZO: 'bg-green-100 text-green-700',
};

export const STATUS_DOT: Record<StatusOP, string> = {
  CONCLUIDA: 'bg-blue-500',
  ATRASADA: 'bg-red-500',
  EM_RISCO: 'bg-yellow-500',
  NO_PRAZO: 'bg-green-500',
};

export interface OrdemParaCalculo {
  qtdEnviada: number;
  qtdRetornada: number;
  prazoAcordado: Date;
}

export interface ResultadoCalculoOP {
  status: StatusOP;
  qtdPendente: number;
  diasRestantes: number; // negativo = já passou o prazo
}

/**
 * Calcula o status e qtd pendente de uma Ordem de Produção.
 * @param ordem - Campos relevantes da ordem
 * @param dataBase - Data de referência (default: new Date() do servidor)
 */
export function calcularStatusOP(
  ordem: OrdemParaCalculo,
  dataBase: Date = new Date()
): ResultadoCalculoOP {
  const { qtdEnviada, qtdRetornada, prazoAcordado } = ordem;

  const qtdPendente = Math.max(0, qtdEnviada - qtdRetornada);

  // Normaliza datas para meia-noite para evitar erros de hora
  const hoje = new Date(dataBase);
  hoje.setHours(0, 0, 0, 0);

  const prazo = new Date(prazoAcordado);
  prazo.setHours(0, 0, 0, 0);

  const diffMs = prazo.getTime() - hoje.getTime();
  const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let status: StatusOP;

  // 1. Concluída: retornada >= enviada (independente de prazo)
  if (qtdRetornada >= qtdEnviada) {
    status = 'CONCLUIDA';
  }
  // 2. Atrasada: data atual > prazo acordado
  else if (diasRestantes < 0) {
    status = 'ATRASADA';
  }
  // 3. Em Risco: (prazo - hoje) <= 3 dias
  else if (diasRestantes <= 3) {
    status = 'EM_RISCO';
  }
  // 4. No Prazo
  else {
    status = 'NO_PRAZO';
  }

  return { status, qtdPendente, diasRestantes };
}

/**
 * Retorna os filtros de data do Prisma correspondentes a um status.
 * Usado em queries server-side para filtrar OPs por status calculado.
 *
 * IMPORTANTE: Como `status` não é uma coluna real no banco, o filtro
 * precisa reproduzir exatamente a mesma lógica de precedência do calcularStatusOP.
 *
 * A query usa a mesma data de referência para consistência.
 */
export function getPrismaWhereParaStatus(
  status: StatusOP,
  dataBase: Date = new Date()
): object {
  const hoje = new Date(dataBase);
  hoje.setHours(0, 0, 0, 0);

  // +3 dias à meia-noite (limite do Em Risco)
  const em3Dias = new Date(hoje);
  em3Dias.setDate(hoje.getDate() + 3);
  em3Dias.setHours(23, 59, 59, 999);

  // Amanhã à meia-noite (início do "dentro do prazo")
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 4);
  amanha.setHours(0, 0, 0, 0);

  switch (status) {
    // Concluída: qtdRetornada >= qtdEnviada
    case 'CONCLUIDA':
      return {
        // Prisma não suporta comparação entre colunas diretamente no where,
        // então usamos um raw filter via AND com expressão custom.
        // Workaround: filtramos onde qtdRetornada > 0 e confiamos que a
        // verificação real é feita via calcularStatusOP no display.
        // Para a query ser precisa usamos uma abordagem via campo calculado:
        AND: [
          {
            // qtdRetornada >= qtdEnviada: como Prisma não suporta column comparison,
            // usamos qtdPendente == 0 via calculação aplicada no JS após fetch.
            // Na query filtramos apenas OPs com qtdRetornada > 0 como aproximação,
            // e o filtro fino é aplicado no JS.
            qtdRetornada: { gt: 0 },
          },
        ],
      };

    // Atrasada: prazo < hoje E qtdRetornada < qtdEnviada
    case 'ATRASADA':
      return {
        prazoAcordado: { lt: hoje },
        // Exclui concluídas (qtdRetornada >= qtdEnviada não é possível no Prisma where diretamente,
        // usamos qtdRetornada como lt qtdEnviada implicitamente via NOT concluída — filtro JS)
      };

    // Em Risco: prazo >= hoje E prazo <= hoje+3 E qtdRetornada < qtdEnviada
    case 'EM_RISCO':
      return {
        prazoAcordado: {
          gte: hoje,
          lte: em3Dias,
        },
      };

    // No Prazo: prazo > hoje+3 E qtdRetornada < qtdEnviada
    case 'NO_PRAZO':
      return {
        prazoAcordado: { gt: em3Dias },
      };
  }
}
