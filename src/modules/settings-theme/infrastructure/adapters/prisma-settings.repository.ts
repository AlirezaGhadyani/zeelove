import type { PrismaClient, Prisma } from '@prisma/client';
import type { SettingsRepositoryPort } from '../../application/ports/settings.repository.port';
import {
  type StoreSettings,
  type ThemeConfig,
  DEFAULT_STORE_SETTINGS,
  DEFAULT_THEME_CONFIG,
  sanitizeThemeConfig,
} from '../../domain/theme-settings';

export class PrismaSettingsRepository implements SettingsRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async getStoreSettings(): Promise<StoreSettings> {
    const record = await this.prisma.systemSetting.findUnique({
      where: { key: 'store_settings' },
    });
    if (!record || !record.value || typeof record.value !== 'object') {
      return DEFAULT_STORE_SETTINGS;
    }
    return {
      ...DEFAULT_STORE_SETTINGS,
      ...(record.value as unknown as Partial<StoreSettings>),
    };
  }

  public async saveStoreSettings(settings: StoreSettings): Promise<void> {
    await this.prisma.systemSetting.upsert({
      where: { key: 'store_settings' },
      update: { value: settings as unknown as Prisma.InputJsonValue },
      create: {
        key: 'store_settings',
        value: settings as unknown as Prisma.InputJsonValue,
        description: 'تنظیمات عمومی فروشگاه زیلاو',
      },
    });
  }

  public async getThemeConfig(): Promise<ThemeConfig> {
    const record = await this.prisma.systemSetting.findUnique({
      where: { key: 'theme_config' },
    });
    if (!record || !record.value || typeof record.value !== 'object') {
      return DEFAULT_THEME_CONFIG;
    }
    return sanitizeThemeConfig(record.value as unknown as Partial<ThemeConfig>);
  }

  public async saveThemeConfig(config: ThemeConfig): Promise<void> {
    const sanitized = sanitizeThemeConfig(config);
    await this.prisma.systemSetting.upsert({
      where: { key: 'theme_config' },
      update: { value: sanitized as unknown as Prisma.InputJsonValue },
      create: {
        key: 'theme_config',
        value: sanitized as unknown as Prisma.InputJsonValue,
        description: 'تنظیمات رنگ و استایل قالب زیلاو',
      },
    });
  }
}
