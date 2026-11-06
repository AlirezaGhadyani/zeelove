import React from 'react';
import { prisma } from '@/shared/infrastructure/database/prisma';
import { DEFAULT_THEME_CONFIG, type ThemeConfig } from '../domain/theme-settings';

export async function ThemeStyles() {
  let theme = DEFAULT_THEME_CONFIG;

  try {
    const record = await prisma.systemSetting.findUnique({
      where: { key: 'theme_config' },
    });
    if (record && record.value) {
      theme = {
        ...DEFAULT_THEME_CONFIG,
        ...(record.value as unknown as Partial<ThemeConfig>),
      };
    }
  } catch {
    // Fallback to default theme if db read fails
  }

  const css = `
    :root {
      --primary: ${theme.primaryColor};
      --radius: ${theme.radius};
    }
  `;

  return (
    <style
      id="zeelove-dynamic-theme"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
