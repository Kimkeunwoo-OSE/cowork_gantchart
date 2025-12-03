import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('Admin user seeded (admin@example.com / 123456).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
