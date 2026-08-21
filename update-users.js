import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashAdmin = await bcrypt.hash('P3dronk@!', 10);
  const adminEmail = 'admin@faccioctrl.com.br';

  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (admin) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashAdmin, plano: 'pro', moduloAuditoria: true }
    });
    console.log('Admin updated');
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        nome: 'Administrador FaccioCtrl',
        password: hashAdmin,
        plano: 'pro',
        moduloAuditoria: true
      }
    });
    console.log('Admin created');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
