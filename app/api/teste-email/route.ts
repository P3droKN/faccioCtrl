import { NextResponse } from 'next/server';
import { sendMagicLinkEmail, sendConfiguracaoExpressaCustomerEmail } from '@/lib/utils/mailer';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const tipo = searchParams.get('tipo') || 'boasvindas';

  if (!email) {
    return NextResponse.json({ erro: 'Forneça um email na URL. Exemplo: /api/teste-email?email=seu@email.com' }, { status: 400 });
  }

  try {
    let success = false;
    
    if (tipo === 'upsell') {
      success = await sendConfiguracaoExpressaCustomerEmail(email, 'Pedro Teste');
    } else {
      success = await sendMagicLinkEmail(email, 'token-de-teste-12345');
    }

    if (success) {
      return NextResponse.json({ 
        sucesso: true, 
        mensagem: `E-mail de ${tipo} enviado com sucesso para ${email}! Verifique sua caixa de entrada e spam.` 
      });
    } else {
      return NextResponse.json({ 
        sucesso: false, 
        erro: 'O e-mail falhou ao ser enviado. Verifique se as variáveis SMTP (Host, User, Pass) estão corretas na Vercel.' 
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
