'use server';

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '@/lib/utils/mailer';

const prisma = new PrismaClient();

export async function solicitarRecuperacao(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Por favor, informe seu e-mail.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Retornar sucesso falso por segurança, para não enumerar e-mails
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hora de validade

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const emailSent = await sendPasswordResetEmail(user.email, token);

    if (!emailSent) {
      return { error: 'Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao solicitar recuperação:', error);
    return { error: 'Ocorreu um erro no servidor.' };
  }
}

export async function validarResetToken(token: string) {
  if (!token) return { valid: false };

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken) return { valid: false };
    if (resetToken.used) return { valid: false, error: 'Este link já foi utilizado.' };
    if (new Date() > resetToken.expiresAt) return { valid: false, error: 'Este link expirou.' };

    return { valid: true, userId: resetToken.userId };
  } catch (error) {
    console.error('Erro ao validar token de reset:', error);
    return { valid: false };
  }
}

export async function redefinirSenha(formData: FormData) {
  const token = formData.get('token') as string;
  const novaSenha = formData.get('novaSenha') as string;
  const confirmSenha = formData.get('confirmSenha') as string;

  if (!token || !novaSenha || !confirmSenha) {
    return { error: 'Preencha todos os campos.' };
  }

  if (novaSenha !== confirmSenha) {
    return { error: 'As senhas não conferem.' };
  }

  if (novaSenha.length < 8) {
    return { error: 'A nova senha deve ter no mínimo 8 caracteres.' };
  }

  try {
    const validToken = await validarResetToken(token);
    if (!validToken.valid || !validToken.userId) {
      return { error: validToken.error || 'Link inválido ou expirado.' };
    }

    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: validToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { token },
        data: { used: true },
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return { error: 'Ocorreu um erro ao redefinir a senha.' };
  }
}
