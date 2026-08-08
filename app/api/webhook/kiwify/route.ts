import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // 1. Signature Validation (HMAC-SHA1 timing-safe)
    const { searchParams } = new URL(req.url);
    const signature = searchParams.get('signature');
    const token = process.env.KIWIFY_WEBHOOK_TOKEN;

    if (!token || !signature) {
      return NextResponse.json({ message: 'Missing token or signature' }, { status: 403 });
    }

    const calculatedSignature = crypto
      .createHmac('sha1', token)
      .update(rawBody)
      .digest('hex');

    if (signature.length !== calculatedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
    }

    // 2. Extração de Dados
    const eventType = payload.order_status || payload.subscription_status || '';
    const email = payload.Customer?.email;
    const productId = payload.Product?.product_id;
    const subscriptionId = payload.Subscription?.id;
    const nextPaymentRaw = payload.Subscription?.next_payment;

    if (!email) {
      return NextResponse.json({ message: 'No email provided' }, { status: 400 });
    }

    let planoStatus: 'pro' | 'cancelado' | null = null;
    let isExpressaConfig = (productId === 'b5e43db0-913e-11f1-a51e-157bea9120b3');
    let isAuditoria = (productId === '73f80c70-92c3-11f1-bf15-e7e84c759762');

    // 3. Mapeamento de Eventos (Assinatura Base)
    switch (eventType) {
      case 'order_approved':
      case 'subscription_renewed':
        if (!isExpressaConfig && !isAuditoria) {
          planoStatus = 'pro';
        }
        break;

      case 'order_rejected':
      case 'subscription_late':
      case 'subscription_canceled':
        if (!isExpressaConfig && !isAuditoria) {
          planoStatus = 'cancelado';
        }
        break;
    }

    // Upsell 1: Configuração Expressa
    if (isExpressaConfig) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        if (eventType === 'order_approved') {
          await prisma.user.update({
            where: { email },
            data: { configuracaoExpressaStatus: 'solicitada', configuracaoExpressaData: new Date() },
          });
          const { sendConfiguracaoExpressaEmail, sendConfiguracaoExpressaCustomerEmail } = require('@/lib/utils/mailer');
          await sendConfiguracaoExpressaEmail(payload.Customer?.full_name, email, payload.Customer?.mobile);
          await sendConfiguracaoExpressaCustomerEmail(email, payload.Customer?.full_name);
        } else if (['order_refunded', 'chargeback'].includes(eventType)) {
          await prisma.user.update({
            where: { email },
            data: { configuracaoExpressaStatus: 'cancelada' },
          });
        }
      }
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Upsell 2: Módulo Auditoria
    if (isAuditoria) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        if (eventType === 'order_approved') {
          await prisma.user.update({
            where: { email },
            data: { moduloAuditoria: true },
          });
        } else if (['order_refunded', 'chargeback'].includes(eventType)) {
          await prisma.user.update({
            where: { email },
            data: { moduloAuditoria: false },
          });
        }
      }
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Assinatura Base Updates
    if (planoStatus) {
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
          await prisma.user.create({
            data: {
              email,
              nome: payload.Customer?.full_name || 'Novo Usuário',
              plano: 'pro',
              subscriptionId: subscriptionId,
              nextPayment: nextPaymentRaw ? new Date(nextPaymentRaw) : undefined,
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
