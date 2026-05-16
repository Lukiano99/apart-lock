import type { Theme as MuiTheme, CssVarsThemeOptions, Components, CssVarsTheme } from '@mui/material/styles';
import type { TypographyOptions } from '@mui/material/styles/createTypography';

// ----------------------------------------------------------------------

export type Theme = Omit<MuiTheme, 'palette' | 'applyStyles'> & CssVarsTheme;

export type ThemeUpdateOptions = Omit<CssVarsThemeOptions, 'typography'> & {
  typography?: TypographyOptions;
};

export type ThemeComponents = Components<Theme>;

export type ThemeColorScheme = 'light' | 'dark';

export type ThemeDirection = 'ltr' | 'rtl';

export type ThemeLocaleComponents = { components: ThemeComponents };
