import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS cart JSONB NOT NULL DEFAULT '[]'::jsonb
  `);
  await prisma.$executeRawUnsafe(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS favorites JSONB NOT NULL DEFAULT '[]'::jsonb
  `);
  console.log('✅ Added cart and favorites columns to users table');
}

main()
  .catch((e) => { console.error('❌ Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
