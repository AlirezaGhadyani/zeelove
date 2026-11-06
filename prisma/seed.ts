import { PrismaClient } from '@prisma/client';

export interface ModuleSeeder {
  readonly name: string;
  seed(prisma: PrismaClient): Promise<void>;
}

export const moduleSeeders: ModuleSeeder[] = [
  {
    name: 'core-system-settings',
    seed: async (prisma) => {
      await prisma.systemSetting.upsert({
        where: { key: 'site_metadata' },
        update: {},
        create: {
          key: 'site_metadata',
          value: {
            title: 'زیلاو',
            description: 'فروشگاه آنلاین زیلاو',
            currency: 'TOMAN',
            locale: 'fa-IR',
          },
          description: 'تنظیمات اولیه سامانه زیلاو',
        },
      });
    },
  },
  {
    name: 'identity-super-admin',
    seed: async (prisma) => {
      const superAdminMobile = process.env.SEED_SUPER_ADMIN_MOBILE ?? '09120000000';
      await prisma.user.upsert({
        where: { mobile: superAdminMobile },
        update: { role: 'SUPER_ADMIN', status: 'ACTIVE' },
        create: {
          mobile: superAdminMobile,
          name: 'مدیر کل زیلاو',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
        },
      });
    },
  },
];

async function main() {
  const prisma = new PrismaClient();
  try {
    for (const seeder of moduleSeeders) {
      // eslint-disable-next-line no-console
      console.log(`[seed] Running seeder: ${seeder.name}`);
      await seeder.seed(prisma);
    }
    // eslint-disable-next-line no-console
    console.log('[seed] All seeders completed successfully.');
  } finally {
    await prisma.$disconnect();
  }
}

if (process.env.NODE_ENV !== 'test') {
  main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('[seed] Seed failed:', error);
    process.exit(1);
  });
}
