const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('❌ Erro: Faltam argumentos.');
    console.log('Uso: node create-admin.js <email> <senha>');
    console.log('Exemplo: node create-admin.js admin@example.com senha123');
    process.exit(1);
  }

  try {
    console.log(`⏳ Criando/atualizando usuário para o e-mail: ${email}...`);
    
    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // O upsert cria o usuário se não existir, ou atualiza se já existir
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        plano: 'pro',
        password: hashedPassword,
        nomeConfeccao: 'Admin',
      },
      create: {
        email,
        nome: 'Admin',
        plano: 'pro',
        password: hashedPassword,
        nomeConfeccao: 'Admin',
      }
    });

    console.log('✅ Usuário administrador criado/atualizado com sucesso!');
    console.log(`- ID: ${user.id}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Plano: ${user.plano}`);
    
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
