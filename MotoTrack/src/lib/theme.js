// src/lib/theme.js
export const colors = {
  background: '#141a24',
  card: '#1c2333',
  surface: '#1a2030',
  surfaceElevated: '#1e2638',
  border: '#242f42',
  primary: '#f97316',
  primaryForeground: '#ffffff',
  foreground: '#f8f9fa',
  mutedForeground: '#6b7a94',
  secondary: '#1e2a3a',
  destructive: '#ef4444',
  destructiveLight: '#fef2f2',
  warning: '#facc15',
  muted: '#1a2030',
  input: '#242f42',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 22, fontWeight: '800', color: colors.foreground },
  h2: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  h3: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  body: { fontSize: 14, fontWeight: '400', color: colors.foreground },
  small: { fontSize: 12, fontWeight: '400', color: colors.mutedForeground },
  tiny: { fontSize: 10, fontWeight: '500', color: colors.mutedForeground },
};
