import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const KIWIFY_SECRET = process.env.KIWIFY_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // 1. Validar Signature
  const url = new URL(req.url);
  const signature = url.searchParams.get('signature');

  if (signature !== KIWIFY_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const eventType = payload.webhook_event_type;
    const email = payload.Customer?.email;
    const subscriptionId = payload.Subscription?.id;
    const nextPaymentRaw = payload.Subscription?.next_payment;

    if (!email) {
      return NextResponse.json({ error: 'No email found in payload' }, { status: 400 });
    }

    let planoStatus: 'pro' | 'cancelado' | null = null;
    let isExpressaConfig = false;

    // Normalize product name to avoid mismatch
    const productName = (payload.Product?.product_name || '').toLowerCase().trim();
    if (productName === 'configuração expressa faccioctrl'.toLowerCase()) {
      isExpressaConfig = true;
    }

    // 2. Mapeamento dos Eventos
    switch (eventType) {
      case 'order_approved':
      case 'subscription_renewed':
        if (!isExpressaConfig) {
          planoStatus = 'pro';
        }
        break;

      case 'order_rejected':
      case 'subscription_late':
      case 'subscription_canceled':
        if (!isExpressaConfig) {
          planoStatus = 'cancelado';
        }
        break;

      default:
        // Ignora eventos que não são de assinatura/venda
        return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    if (eventType === 'order_approved' && isExpressaConfig) {
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (user) {
        await prisma.user.update({
          where: { email },
          data: {
            configuracaoExpressaStatus: 'solicitada',
            configuracaoExpressaData: new Date(),
          },
        });
        
        const { sendConfiguracaoExpressaEmail, sendConfiguracaoExpressaCustomerEmail } = require('@/lib/utils/mailer');
        
        // 1. Avisa o fundador
        await sendConfiguracaoExpressaEmail(
          payload.Customer?.full_name,
          email,
          payload.Customer?.mobile
        );
        
        // 2. Envia as instruções e o link do Telegram para o cliente
        await sendConfiguracaoExpressaCustomerEmail(
          email,
          payload.Customer?.full_name
        );
      }
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (planoStatus) {
      // 3. Atualizar no banco
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (user) {
        // Usuário existe, atualiza
        await prisma.user.update({
          where: { email },
          data: {
            plano: planoStatus,
            subscriptionId: subscriptionId || user.subscriptionId,
            nextPayment: nextPaymentRaw ? new Date(nextPaymentRaw) : user.nextPayment,
          },
        });
      } else {
        // Usuário não existe
        if (planoStatus === 'pro') {
          // Cria o usuário apenas se for evento de aprovação
          const newUser = await prisma.user.create({
            data: {
              email,
              nome: payload.Customer?.full_name || 'Novo Usuário',
              plano: 'pro',
              subscriptionId: subscriptionId,
              nextPayment: nextPaymentRaw ? new Date(nextPaymentRaw) : undefined,
              // password e nomeConfeccao são opcionais agora e serão preenchidos no primeiro acesso
            }
          });

          // Gera Token de 24h
          const crypto = require('crypto');
          const tokenStr = crypto.randomBytes(32).toString('hex');
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);

          await prisma.accessToken.create({
            data: {
              token: tokenStr,
              userId: newUser.id,
              expiresAt,
            }
          });

          // Dispara E-mail com o link mágico (dinâmico)
          // Usamos require para evitar conflitos de build/serverless dependendo do Next.js
          const { sendMagicLinkEmail } = require('@/lib/utils/mailer');
          await sendMagicLinkEmail(email, tokenStr);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
