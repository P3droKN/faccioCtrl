'use server';

import { cookies } from 'next/headers';
import { decrypt } from './auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function atualizarDadosConta(formData: FormData) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return { error: 'Não autorizado.' };

  let session;
  try {
    session = await decrypt(sessionCookie);
  } catch {
    return { error: 'Sessão inválida.' };
  }

  const userId = session.id;
  const nome = formData.get('nome') as string;
  const nomeConfeccao = formData.get('nomeConfeccao') as string;
  const email = formData.get('email') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const avatarFile = formData.get('avatar') as File | null;

  if (!nome || !nomeConfeccao || !email) {
    return { error: 'Nome, Nome da confecção e E-mail são obrigatórios.' };
  }

  // Verifica email único (se for diferente do atual)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: 'Usuário não encontrado.' };

  if (email !== user.email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return { error: 'Este e-mail já está em uso.' };
    }
  }

  let avatarUrl = user.avatarUrl;

  // Handle avatar upload
  if (avatarFile && avatarFile.size > 0) {
    if (avatarFile.size > 2 * 1024 * 1024) {
      return { error: 'A imagem deve ter no máximo 2MB.' };
    }
    const ext = avatarFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      return { error: 'Apenas arquivos JPG ou PNG são permitidos.' };
    }

    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public/uploads/avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${userId}-${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, buffer);
    avatarUrl = `/uploads/avatars/${filename}`;
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        nome,
        nomeConfeccao,
        email,
        whatsapp,
        avatarUrl,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { error: 'Ocorreu um erro ao atualizar os dados.' };
  }
}

export async function alterarSenha(formData: FormData) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return { error: 'Não autorizado.' };

  let session;
  try {
    session = await decrypt(sessionCookie);
  } catch {
    return { error: 'Sessão inválida.' };
  }

  const userId = session.id;
  const senhaAtual = formData.get('senhaAtual') as string;
  const novaSenha = formData.get('novaSenha') as string;
  const confirmSenha = formData.get('confirmSenha') as string;

  if (!senhaAtual || !novaSenha || !confirmSenha) {
    return { error: 'Preencha todos os campos.' };
  }

  if (novaSenha !== confirmSenha) {
    return { error: 'A nova senha e a confirmação não conferem.' };
  }

  if (novaSenha.length < 8) {
    return { error: 'A nova senha deve ter no mínimo 8 caracteres.' };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) {
    return { error: 'Usuário não encontrado ou não possui senha definida.' };
  }

  const isValid = await bcrypt.compare(senhaAtual, user.password);
  if (!isValid) {
    return { error: 'Senha atual incorreta.' };
  }

  const hashedPassword = await bcrypt.hash(novaSenha, 10);

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return { error: 'Ocorreu um erro ao alterar a senha.' };
  }
}
