import * as React from 'react';
import { ThemeProvider, createTheme, experimental_sx as sx, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          palette: colorSchemes.light.palette,
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <CssVarsProvider defaultMode="dark">
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CssVarsProvider>
  );
}
