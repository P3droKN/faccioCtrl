'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/app/actions/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function validateToken(token: string) {
  if (!token) return { error: 'Token não fornecido.' };

  const accessToken = await prisma.accessToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!accessToken) {
    return { error: 'Link de acesso inválido ou não existe.' };
  }

  if (accessToken.used) {
    return { error: 'Este link já foi utilizado.' };
  }

  if (new Date() > accessToken.expiresAt) {
    return { error: 'Este link expirou. Por favor, solicite um novo acesso.' };
  }

  return { success: true, user: accessToken.user };
}

export async function finalizarCadastro(formData: FormData) {
  const token = formData.get('token') as string;
  const nomeConfeccao = formData.get('nome_confeccao') as string;
  const senha = formData.get('senha') as string;
  const confirmSenha = formData.get('confirmSenha') as string;

  if (!token || !nomeConfeccao || !senha || !confirmSenha) {
    return { error: 'Preencha todos os campos.' };
  }

  if (senha !== confirmSenha) {
    return { error: 'As senhas não conferem.' };
  }

  if (senha.length < 6) {
    return { error: 'A senha deve ter no mínimo 6 caracteres.' };
  }

  // 1. Valida o Token novamente por segurança
  const accessToken = await prisma.accessToken.findUnique({
    where: { token },
  });

  if (!accessToken || accessToken.used || new Date() > accessToken.expiresAt) {
    return { error: 'Token inválido ou expirado.' };
  }

  try {
    // 2. Cria Hash da Senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // 3. Atualiza o Usuário
    const user = await prisma.user.update({
      where: { id: accessToken.userId },
      data: {
        nomeConfeccao,
        password: hashedPassword,
      },
    });

    // 4. Invalida o Token
    await prisma.accessToken.update({
      where: { id: accessToken.id },
      data: { used: true },
    });

    // 5. Faz Login Automático (Cria a Sessão)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ id: user.id, nome: user.nome, plano: user.plano });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return { success: true };
  } catch (err: any) {
    console.error('Finalizar Cadastro Error:', err);
    return { error: 'Erro ao salvar os dados: ' + (err.message || 'Desconhecido') };
  }
}
