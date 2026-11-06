import { describe, it, expect } from 'vitest';
import {
  sanitizeThemeConfig,
  DEFAULT_THEME_CONFIG,
} from '@/modules/settings-theme/domain/theme-settings';

describe('Theme Sanitizer Unit Test', () => {
  it('accepts valid hex colors and dimensions', () => {
    const config = sanitizeThemeConfig({
      primaryColor: '#f59e0b',
      radius: '1rem',
      fontScale: 'lg',
    });

    expect(config.primaryColor).toBe('#f59e0b');
    expect(config.radius).toBe('1rem');
    expect(config.fontScale).toBe('lg');
  });

  it('accepts valid HSL colors', () => {
    const config = sanitizeThemeConfig({
      primaryColor: 'hsl(210, 80%, 45%)',
      radius: '0.5rem',
    });

    expect(config.primaryColor).toBe('hsl(210, 80%, 45%)');
    expect(config.radius).toBe('0.5rem');
  });

  it('rejects CSS injection payload in primaryColor and falls back to default', () => {
    const malicious = sanitizeThemeConfig({
      primaryColor: '#000; } body { display: none !important; } /*',
      radius: '0.75rem',
    });

    expect(malicious.primaryColor).toBe(DEFAULT_THEME_CONFIG.primaryColor);
  });

  it('rejects CSS injection payload in radius and falls back to default', () => {
    const malicious = sanitizeThemeConfig({
      primaryColor: '#0d9488',
      radius: '10px; background: url(https://evil.com) /*',
    });

    expect(malicious.radius).toBe(DEFAULT_THEME_CONFIG.radius);
  });

  it('normalizes invalid font scales to default md', () => {
    // @ts-expect-error testing invalid runtime value
    const config = sanitizeThemeConfig({ fontScale: 'extra-large' });
    expect(config.fontScale).toBe('md');
  });
});
