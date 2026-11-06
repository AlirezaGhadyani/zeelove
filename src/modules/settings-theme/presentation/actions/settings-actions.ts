'use server';

import { prisma } from '@/shared/infrastructure/database/prisma';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { PrismaAuditService } from '@/modules/audit';
import { getSessionToken, IDENTITY_TOKENS } from '@/modules/identity-access';
import { type StoreSettings, type ThemeConfig } from '../../domain/theme-settings';
import { PrismaSettingsRepository } from '../../infrastructure/adapters/prisma-settings.repository';

const settingsRepo = new PrismaSettingsRepository(prisma);
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
  return settingsRepo.getStoreSettings();
}

export async function updateStoreSettingsAction(data: Partial<StoreSettings>) {
  const current = await settingsRepo.getStoreSettings();
  const updated: StoreSettings = { ...current, ...data };

  await settingsRepo.saveStoreSettings(updated);

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
  return settingsRepo.getThemeConfig();
}

export async function updateThemeConfigAction(data: Partial<ThemeConfig>) {
  const current = await settingsRepo.getThemeConfig();
  const updated: ThemeConfig = { ...current, ...data };

  await settingsRepo.saveThemeConfig(updated);

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
