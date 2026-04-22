import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { default: prisma } = await import('../server/lib/prisma.js');

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@appsolutions.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`Admin user already exists: ${adminEmail}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  console.log('Seeded admin user:', user.email);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
