import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'pedronicolodikerber06@gmail.com';
  const password = 'Pedro1414';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      plano: 'pro',
      moduloAuditoria: false
    },
    create: {
      email,
      nome: 'Pedro Admin',
      password: hashedPassword,
      plano: 'pro',
      moduloAuditoria: false
    }
  });

  console.log('User upserted successfully:', user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
