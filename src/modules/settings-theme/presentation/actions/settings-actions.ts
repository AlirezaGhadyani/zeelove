'use server';

import { prisma } from '@/shared/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { PrismaAuditService } from '@/modules/audit';
import {
  getSessionToken,
  IDENTITY_TOKENS,
} from '@/modules/identity-access';
import {
  type StoreSettings,
  type ThemeConfig,
  DEFAULT_STORE_SETTINGS,
  DEFAULT_THEME_CONFIG,
} from '../../domain/theme-settings';

const auditService = new PrismaAuditService(prisma);

async function getAdminUser() {
  const token = await getSessionToken();
  if (!token) return null;
  const container = createAppContainer();
  const getCurrentUser = container.resolve(IDENTITY_TOKENS.GetCurrentUserUseCase);
  const res = await getCurrentUser.execute({ sessionToken: token });
  return res.isOk ? res.value : null;
}

export async function getStoreSettingsAction(): Promise<StoreSettings> {
  const record = await prisma.systemSetting.findUnique({
    where: { key: 'store_settings' },
  });
  if (!record || !record.value) {
    return DEFAULT_STORE_SETTINGS;
  }
  return { ...DEFAULT_STORE_SETTINGS, ...(record.value as unknown as Partial<StoreSettings>) };
}

export async function updateStoreSettingsAction(data: Partial<StoreSettings>) {
  const current = await getStoreSettingsAction();
  const updated: StoreSettings = { ...current, ...data };

  await prisma.systemSetting.upsert({
    where: { key: 'store_settings' },
    update: { value: updated as unknown as Prisma.InputJsonValue },
    create: {
      key: 'store_settings',
      value: updated as unknown as Prisma.InputJsonValue,
      description: 'تنظیمات عمومی فروشگاه زیلاو',
    },
  });

  const admin = await getAdminUser();
  if (admin) {
    await auditService.record({
      adminId: admin.id,
      action: 'UPDATE_STORE_SETTINGS',
      entity: 'SystemSetting',
      entityId: 'store_settings',
      before: current as unknown as Record<string, unknown>,
      after: updated as unknown as Record<string, unknown>,
    });
  }

  return { ok: true, settings: updated };
}

export async function getThemeConfigAction(): Promise<ThemeConfig> {
  const record = await prisma.systemSetting.findUnique({
    where: { key: 'theme_config' },
  });
  if (!record || !record.value) {
    return DEFAULT_THEME_CONFIG;
  }
  return { ...DEFAULT_THEME_CONFIG, ...(record.value as unknown as Partial<ThemeConfig>) };
}

export async function updateThemeConfigAction(data: Partial<ThemeConfig>) {
  const current = await getThemeConfigAction();
  const updated: ThemeConfig = { ...current, ...data };

  await prisma.systemSetting.upsert({
    where: { key: 'theme_config' },
    update: { value: updated as unknown as Prisma.InputJsonValue },
    create: {
      key: 'theme_config',
      value: updated as unknown as Prisma.InputJsonValue,
      description: 'تنظیمات رنگ و استایل قالب زیلاو',
    },
  });

  const admin = await getAdminUser();
  if (admin) {
    await auditService.record({
      adminId: admin.id,
      action: 'UPDATE_THEME_CONFIG',
      entity: 'SystemSetting',
      entityId: 'theme_config',
      before: current as unknown as Record<string, unknown>,
      after: updated as unknown as Record<string, unknown>,
    });
  }

  return { ok: true, theme: updated };
}
