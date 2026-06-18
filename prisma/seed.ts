import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  const password = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@gmail.com',
    },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@gmail.com',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Admin seeded');
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
