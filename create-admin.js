const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Uso incorreto. Você deve passar o e-mail e a senha como parâmetros.');
    console.log('Exemplo: node create-admin.js seuemail@gmail.com suasenha123');
    process.exit(1);
  }

  const [email, password] = args;

  try {
    console.log(`Buscando ou criando administrador com e-mail: ${email}...`);
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        plano: 'pro',
      },
      create: {
        email,
        password: hashedPassword,
        nome: 'Administrador FaccioCtrl',
        nomeConfeccao: 'FaccioCtrl Admin',
        plano: 'pro',
      },
    });

    console.log('\n✅ Administrador configurado com sucesso!');
    console.log('--------------------------------------------------');
    console.log(`ID: ${user.id}`);
    console.log(`E-mail: ${user.email}`);
    console.log(`Plano: ${user.plano}`);
    console.log('--------------------------------------------------');
    console.log('Você já pode fazer login na plataforma.');

  } catch (error) {
    console.error('\n❌ Erro ao criar o administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
