const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.delete({ where: { email: 'admin@test.com' } });
  console.log('Deleted');
}

main().catch(console.error).finally(() => prisma.$disconnect());
