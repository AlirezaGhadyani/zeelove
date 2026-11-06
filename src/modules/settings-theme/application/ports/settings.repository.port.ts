import type { StoreSettings, ThemeConfig } from '../../domain/theme-settings';

export interface SettingsRepositoryPort {
  getStoreSettings(): Promise<StoreSettings>;
  saveStoreSettings(settings: StoreSettings): Promise<void>;
  getThemeConfig(): Promise<ThemeConfig>;
  saveThemeConfig(config: ThemeConfig): Promise<void>;
}
