import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Vercel serverless functions için Prisma client singleton
export const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Vercel için optimize edilmiş ayarlar
  errorFormat: 'pretty',
  rejectOnNotFound: false,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Vercel'de graceful shutdown ve connection management
if (process.env.NODE_ENV === 'production') {
  // Connection timeout
  const connectionTimeout = setTimeout(async () => {
    await prisma.$disconnect();
  }, 30000); // 30 saniye timeout

  process.on('beforeExit', async () => {
    clearTimeout(connectionTimeout);
    await prisma.$disconnect();
  });

  process.on('SIGINT', async () => {
    clearTimeout(connectionTimeout);
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    clearTimeout(connectionTimeout);
    await prisma.$disconnect();
    process.exit(0);
  });
}

export default prisma;
