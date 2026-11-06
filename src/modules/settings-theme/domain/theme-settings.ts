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
