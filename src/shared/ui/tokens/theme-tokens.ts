export interface ThemeTokens {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  motion: {
    fast: string;
    normal: string;
    slow: string;
  };
}

/**
 * Palette Rationale:
 * A deep slate/obsidian neutral base paired with a warm desert-saffron amber accent (hsl(38 92% 50%)),
 * evoking Persian artisanal elegance and high-contrast digital luxury.
 */
export const defaultTokens: { light: ThemeTokens; dark: ThemeTokens } = {
  light: {
    colors: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(224 71% 4%)',
      primary: 'hsl(224 71% 4%)',
      primaryForeground: 'hsl(0 0% 100%)',
      accent: 'hsl(38 92% 50%)',
      accentForeground: 'hsl(224 71% 4%)',
      muted: 'hsl(220 14% 96%)',
      mutedForeground: 'hsl(220 9% 46%)',
      border: 'hsl(220 13% 91%)',
      success: 'hsl(142 71% 45%)',
      warning: 'hsl(38 92% 50%)',
      danger: 'hsl(0 84% 60%)',
    },
    radius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    },
    motion: {
      fast: '150ms ease',
      normal: '250ms ease',
      slow: '400ms ease',
    },
  },
  dark: {
    colors: {
      background: 'hsl(224 71% 4%)',
      foreground: 'hsl(210 20% 98%)',
      primary: 'hsl(210 20% 98%)',
      primaryForeground: 'hsl(224 71% 4%)',
      accent: 'hsl(38 92% 50%)',
      accentForeground: 'hsl(224 71% 4%)',
      muted: 'hsl(217 33% 17%)',
      mutedForeground: 'hsl(215 20% 65%)',
      border: 'hsl(217 33% 17%)',
      success: 'hsl(142 71% 45%)',
      warning: 'hsl(38 92% 50%)',
      danger: 'hsl(0 84% 60%)',
    },
    radius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    },
    motion: {
      fast: '150ms ease',
      normal: '250ms ease',
      slow: '400ms ease',
    },
  },
};
