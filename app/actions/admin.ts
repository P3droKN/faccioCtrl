'use server';

import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_COOKIE_NAME = 'faccio_admin_token';

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: 'ADMIN_PASSWORD não configurada no servidor.' };
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    // Define the cookie with 24 hours expiration
    cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    return { success: true };
  }

  return { error: 'Senha incorreta.' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return { success: true };
}

export async function getAdminData() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === 'authenticated';

  if (!isAdmin) {
    return { authorized: false, users: [], totalUsers: 0, totalProUsers: 0 };
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        nomeConfeccao: true,
        email: true,
        plano: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalUsers = users.length;
    const totalProUsers = users.filter(u => u.plano === 'pro').length;

    return {
      authorized: true,
      users,
      totalUsers,
      totalProUsers,
    };
  } catch (error) {
    console.error('Erro ao buscar dados do painel admin:', error);
    return { authorized: true, error: 'Erro ao buscar usuários.', users: [], totalUsers: 0, totalProUsers: 0 };
  }
}
