import { PrismaClient } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/actions/auth';
import PrintButton from './PrintButton';

const prisma = new PrismaClient();

export default async function ImprimirOrdemPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) redirect('/login');

  let session: any;
  try {
    session = await decrypt(sessionCookie);
  } catch {
    redirect('/login');
  }

  const ordemId = parseInt(params.id, 10);
  if (isNaN(ordemId)) notFound();

  const ordem = await prisma.ordem.findFirst({
    where: { 
      id: ordemId,
      userId: session.id 
    },
    include: {
      faccao: true,
      user: true,
    }
  });

  if (!ordem) notFound();

  return (
    <div className="bg-white min-h-screen p-8 text-black font-sans max-w-4xl mx-auto border shadow-sm print:border-none print:shadow-none print:p-0">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">{ordem.user.nomeConfeccao || ordem.user.nome}</h1>
          <p className="text-gray-600 mt-1">Ficha de Ordem de Produção (OP)</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-900">OP #{ordem.numeroOrdem}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Emitida em: {new Date(ordem.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        
        {/* Facção */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Dados da Facção</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-bold text-lg text-gray-900 mb-1">{ordem.faccao.nome}</p>
            {ordem.faccao.codigo && <p className="text-gray-700 text-sm">Código: {ordem.faccao.codigo}</p>}
            {ordem.faccao.contato && <p className="text-gray-700 text-sm">Contato: {ordem.faccao.contato}</p>}
          </div>
        </div>

        {/* Prazos */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Datas e Prazos</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Data de Envio</p>
              <p className="font-semibold text-gray-900">{new Date(ordem.dataEnvio).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Prazo Acordado</p>
              <p className="font-semibold text-gray-900">{new Date(ordem.prazoAcordado).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Produto details */}
      <div className="mb-10">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Detalhes da Produção</h3>
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-700">Produto / Peça</th>
              <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-700 w-1/4 text-center">Qtd. Enviada</th>
              <th className="border border-gray-300 px-4 py-3 font-semibold text-gray-700 w-1/4 text-center">Qtd. Retornada</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-4 font-medium text-gray-900">{ordem.produto}</td>
              <td className="border border-gray-300 px-4 py-4 text-center text-xl font-bold text-gray-900">{ordem.qtdEnviada}</td>
              <td className="border border-gray-300 px-4 py-4 text-center text-xl font-bold text-gray-900">{ordem.qtdRetornada}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Observações */}
      {ordem.observacao && (
        <div className="mb-16">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Observações</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[80px]">
            <p className="text-gray-800 whitespace-pre-wrap">{ordem.observacao}</p>
          </div>
        </div>
      )}

      {/* Signatures */}
      <div className="mt-20 pt-10 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8 text-center">Comprovante de Movimentação</h3>
        <div className="grid grid-cols-2 gap-12">
          
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-8">RETIRADA (Envio para a Facção)</p>
            <div className="border-b border-gray-800 w-full mb-2"></div>
            <p className="font-semibold text-gray-900 text-sm">Assinatura da Facção</p>
            <p className="text-xs text-gray-500">Data: ___/___/20___</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-8">DEVOLUÇÃO (Retorno para a Confecção)</p>
            <div className="border-b border-gray-800 w-full mb-2"></div>
            <p className="font-semibold text-gray-900 text-sm">Assinatura da Facção</p>
            <p className="text-xs text-gray-500">Data: ___/___/20___</p>
          </div>

        </div>
      </div>

      {/* Hidden button to trigger print manually if auto-print fails or gets blocked */}
      <div className="mt-12 text-center print:hidden">
        <PrintButton />
      </div>

    </div>
  );
}
