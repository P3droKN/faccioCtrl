import nodemailer from 'nodemailer';

export async function sendMagicLinkEmail(to: string, token: string) {
  const SMTP_HOST = process.env.SMTP_HOST?.trim();
  const SMTP_PORT = process.env.SMTP_PORT?.trim();
  const SMTP_USER = process.env.SMTP_USER?.trim();
  const SMTP_PASS = process.env.SMTP_PASS?.trim();

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('SMTP credentials missing in .env');
    return false;
  }

  const isGmail = SMTP_HOST?.includes('gmail');

  const transporter = nodemailer.createTransport(
    isGmail 
      ? {
          service: 'gmail',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        }
      : {
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 465,
          secure: Number(SMTP_PORT) === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        }
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const magicLink = `${appUrl}/primeiro-acesso?token=${token}`;

  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #1F3864; margin: 0; padding: 40px 20px; min-height: 100vh;">
      <div style="max-w: 600px; margin: 0 auto;">
        
        <!-- Logo Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">
            <span style="display: inline-block; background-color: rgba(255,255,255,0.1); padding: 8px; border-radius: 12px; margin-right: 8px; border: 1px solid rgba(255,255,255,0.2); vertical-align: middle;">✂️</span>
            FaccioCtrl
          </h1>
        </div>

        <!-- Main Card -->
        <div style="background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center;">
          <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Assinatura Ativada!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            Sua assinatura no FaccioCtrl foi confirmada com sucesso. Para começar a gerenciar sua produção e eliminar os atrasos, você precisa configurar sua senha de acesso inicial.
          </p>
          
          <a href="${magicLink}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 700; padding: 16px 32px; border-radius: 12px; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);">
            Configurar Minha Conta
          </a>
          
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f3f4f6;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              Este link é seguro, válido por 24 horas e só pode ser utilizado uma vez.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; color: rgba(255,255,255,0.6); font-size: 13px;">
          <p style="margin-bottom: 8px;">Se você não fez essa assinatura, apenas ignore este e-mail.</p>
          <p style="margin: 0;">© ${new Date().getFullYear()} FaccioCtrl. Gestão inteligente para confecções.</p>
        </div>

      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"FaccioCtrl" <${SMTP_USER}>`,
      to,
      subject: 'Acesso Liberado - Defina sua Senha no FaccioCtrl',
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const SMTP_HOST = process.env.SMTP_HOST?.trim();
  const SMTP_PORT = process.env.SMTP_PORT?.trim();
  const SMTP_USER = process.env.SMTP_USER?.trim();
  const SMTP_PASS = process.env.SMTP_PASS?.trim();

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('SMTP credentials missing in .env');
    return false;
  }

  const isGmail = SMTP_HOST?.includes('gmail');

  const transporter = nodemailer.createTransport(
    isGmail 
      ? {
          service: 'gmail',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        }
      : {
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 465,
          secure: Number(SMTP_PORT) === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        }
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetLink = `${appUrl}/redefinir-senha?token=${token}`;

  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #1F3864; margin: 0; padding: 40px 20px; min-height: 100vh;">
      <div style="max-w: 600px; margin: 0 auto;">
        
        <!-- Logo Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">
            <span style="display: inline-block; background-color: rgba(255,255,255,0.1); padding: 8px; border-radius: 12px; margin-right: 8px; border: 1px solid rgba(255,255,255,0.2); vertical-align: middle;">✂️</span>
            FaccioCtrl
          </h1>
        </div>

        <!-- Main Card -->
        <div style="background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center;">
          <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Recuperação de Senha</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            Recebemos uma solicitação para redefinir a senha da sua conta no FaccioCtrl. Clique no botão abaixo para criar uma nova senha.
          </p>
          
          <a href="${resetLink}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 700; padding: 16px 32px; border-radius: 12px; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);">
            Redefinir Minha Senha
          </a>
          
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f3f4f6;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              Este link é seguro, válido por 1 hora e só pode ser utilizado uma vez. Se não foi você quem solicitou, apenas ignore este e-mail.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; color: rgba(255,255,255,0.6); font-size: 13px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} FaccioCtrl. Gestão inteligente para confecções.</p>
        </div>

      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"FaccioCtrl" <${SMTP_USER}>`,
      to,
      subject: 'Recuperação de Senha - FaccioCtrl',
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
}

export async function sendConfiguracaoExpressaEmail(nomeCliente: string, emailCliente: string, mobileCliente: string) {
  const SMTP_HOST = process.env.SMTP_HOST?.trim();
  const SMTP_PORT = process.env.SMTP_PORT?.trim();
  const SMTP_USER = process.env.SMTP_USER?.trim();
  const SMTP_PASS = process.env.SMTP_PASS?.trim();
  const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL?.trim() || SMTP_USER;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FOUNDER_EMAIL) {
    console.error('SMTP credentials missing in .env');
    return false;
  }

  const isGmail = SMTP_HOST?.includes('gmail');

  const transporter = nodemailer.createTransport(
    isGmail 
      ? {
          service: 'gmail',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        }
      : {
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 465,
          secure: Number(SMTP_PORT) === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        }
  );

  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #111827; margin-top: 0;">Nova Venda: Configuração Expressa 🚀</h2>
        <p style="color: #4b5563; font-size: 16px;">O cliente abaixo acabou de comprar o Upsell de Configuração Expressa. Você tem 48h para realizar a entrega do serviço.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 10px;"><strong>Nome:</strong> ${nomeCliente || 'Não informado'}</p>
          <p style="margin: 0 0 10px;"><strong>E-mail:</strong> ${emailCliente || 'Não informado'}</p>
          <p style="margin: 0;"><strong>WhatsApp:</strong> ${mobileCliente || 'Não informado'}</p>
        </div>
        
        <p style="color: #ef4444; font-weight: bold; margin-bottom: 0;">Lembrete: Prazo de entrega é 48h a partir de agora!</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"FaccioCtrl Sistema" <${SMTP_USER}>`,
      to: FOUNDER_EMAIL,
      subject: '🚀 Nova Configuração Expressa Solicitada!',
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
}
