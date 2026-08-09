import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'pedronicolodikerber06@gmail.com';

  const user = await prisma.user.update({
    where: { email },
    data: {
      moduloAuditoria: true
    }
  });

  console.log('Módulo de auditoria liberado para:', user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
