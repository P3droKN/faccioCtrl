import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/actions/auth';
import { ShieldAlert, AlertTriangle, MessageCircle, Lock } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

// Helper to format phone number for WhatsApp API
function formatWhatsApp(phone: string | null) {
  if (!phone) return '';
  let cleaned = phone.replace(/\\D/g, '');
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = '55' + cleaned;
  }
  return cleaned;
}

export default async function AuditoriaPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  const session = await decrypt(sessionCookie);
  if (!session?.id) {
    redirect('/login');
  }

  const userId = session.id as number;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { moduloAuditoria: true }
  });

  if (!user) {
    redirect('/login');
  }

  // Fetch late orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lateOrders = await prisma.ordem.findMany({
    where: {
      userId,
      qtdRetornada: {
        lt: prisma.ordem.fields.qtdEnviada
      },
      prazoAcordado: {
        lt: today
      }
    },
    include: {
      faccao: true
    },
    orderBy: {
      prazoAcordado: 'asc'
    }
  });

  const isUnlocked = user.moduloAuditoria;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Auditoria de Atrasos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitoramento automático de ordens que passaram da data de entrega.
          </p>
        </div>
      </div>

      {!isUnlocked && lateOrders.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-800">Atenção Crítica</h3>
            <p className="text-sm text-red-700 mt-1">
              O sistema detectou <strong>{lateOrders.length} ordens atrasadas</strong> na sua produção que precisam de cobrança imediata.
            </p>
          </div>
        </div>
      )}

      {/* Tabela de Ordens */}
      <div className="relative mt-4">
        
        {!isUnlocked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recurso Bloqueado</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Você tem {lateOrders.length} ordens atrasadas paradas nas suas facções. Desbloqueie o Módulo de Auditoria para ver os detalhes e cobrar automaticamente via WhatsApp.
              </p>
              <a 
                href="https://kiwify.app/N78qiFY" 
                target="_blank"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-200"
              >
                Desbloquear Módulo agora
              </a>
            </div>
          </div>
        )}

        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden \${!isUnlocked ? 'blur-[3px] select-none pointer-events-none' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Facção</th>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Status do Atraso</th>
                  <th className="px-6 py-4">Ação</th>
                </tr>
              </thead>
              <tbody>
                {lateOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <ShieldAlert className="w-12 h-12 text-green-300 mx-auto mb-3" />
                      <p className="text-lg font-medium text-gray-900">Nenhum atraso detectado!</p>
                      <p>Sua produção está 100% em dia.</p>
                    </td>
                  </tr>
                ) : (
                  lateOrders.map((ordem) => {
                    const daysLate = Math.floor((today.getTime() - new Date(ordem.prazoAcordado).getTime()) / (1000 * 60 * 60 * 24));
                    const whatsappNumber = formatWhatsApp(ordem.faccao.whatsapp);
                    const whatsappMessage = encodeURIComponent(`Olá! Notamos que a Ordem \${ordem.numeroOrdem} (\${ordem.produto}) estava prevista para \${ordem.prazoAcordado.toLocaleDateString('pt-BR')}. Qual a previsão de entrega?`);
                    const whatsappLink = `https://wa.me/\${whatsappNumber}?text=\${whatsappMessage}`;

                    return (
                      <tr key={ordem.id} className="border-b border-gray-100 hover:bg-red-50/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {ordem.faccao.nome}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{ordem.produto}</div>
                            <div className="text-xs text-gray-500">Ordem #{ordem.numeroOrdem}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <Clock className="w-3.5 h-3.5" />
                            {daysLate} {daysLate === 1 ? 'dia' : 'dias'} atrasado
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a 
                            href={isUnlocked ? whatsappLink : '#'}
                            target="_blank"
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Cobrar
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
