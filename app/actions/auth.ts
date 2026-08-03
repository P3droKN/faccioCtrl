'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const secretKey = 'sua-chave-secreta-muito-segura-aqui';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('senha') as string;

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return { error: 'E-mail ou senha inválidos.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: 'E-mail ou senha inválidos.' };
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ id: user.id, nome: user.nome, plano: user.plano });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return { success: true };
  } catch (err: any) {
    console.error('Login Error:', err);
    return { error: 'Erro no servidor: ' + (err.message || 'Erro desconhecido') };
  }
}

export async function registerAction(formData: FormData) {
  const nome = formData.get('nome') as string;
  const email = formData.get('email') as string;
  const nome_confeccao = formData.get('nome_confeccao') as string;
  const senha = formData.get('senha') as string;
  const confirmSenha = formData.get('confirmSenha') as string;

  if (!nome || !email || !nome_confeccao || !senha || !confirmSenha) {
    return { error: 'Preencha todos os campos.' };
  }

  if (senha !== confirmSenha) {
    return { error: 'As senhas não conferem.' };
  }

  if (senha.length < 6) {
    return { error: 'A senha deve ter no mínimo 6 caracteres.' };
  }

  try {
    // Verifica se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Este e-mail já está em uso.' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        nomeConfeccao: nome_confeccao,
        password: hashedPassword,
      },
    });

    // Cria a sessão
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ id: user.id, nome: user.nome, plano: user.plano });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return { success: true };
  } catch (err: any) {
    console.error('Register Error:', err);
    return { error: 'Ocorreu um erro inesperado ao salvar: ' + (err.message || 'Erro desconhecido') };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
