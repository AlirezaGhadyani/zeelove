export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  seoTitle?: string;
  seoDescription?: string;
  currency: string;
}

export interface ThemeConfig {
  primaryColor: string; // Hex or HSL (e.g., #0d9488 or hsl(175, 84%, 32%))
  radius: string; // e.g. 0.5rem, 0.75rem
  fontScale: 'sm' | 'md' | 'lg';
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'زیلاو',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'info@zeelove.ir',
  contactPhone: '۰۲۱-۸۸۸۸۸۸۸۸',
  seoTitle: 'زیلاو | فروشگاه آنلاین و مجله تخصصی',
  seoDescription: 'زیلاو، فروشگاه آنلاین زیورآلات و پوشاک با بالاترین کیفیت و ضمانت اصالت کالا.',
  currency: 'TOMAN',
};

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  primaryColor: '#0d9488',
  radius: '0.75rem',
  fontScale: 'md',
};

export const SAFE_COLOR_REGEX =
  /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\))$/;
export const SAFE_RADIUS_REGEX = /^(\d+(\.\d+)?(rem|px|em)|0)$/;

export function sanitizeThemeConfig(config: Partial<ThemeConfig>): ThemeConfig {
  const primaryColor =
    config.primaryColor && SAFE_COLOR_REGEX.test(config.primaryColor.trim())
      ? config.primaryColor.trim()
      : DEFAULT_THEME_CONFIG.primaryColor;

  const radius =
    config.radius && SAFE_RADIUS_REGEX.test(config.radius.trim())
      ? config.radius.trim()
      : DEFAULT_THEME_CONFIG.radius;

  const fontScale =
    config.fontScale === 'sm' || config.fontScale === 'lg' ? config.fontScale : 'md';

  return { primaryColor, radius, fontScale };
}
