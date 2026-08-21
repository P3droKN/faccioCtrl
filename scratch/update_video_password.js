const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'video@faccioctrl.com.br';
  const newPassword = 'video@';

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.error(`Usuário com email ${email} não encontrado.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`Senha atualizada com sucesso para ${email}!`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
