'use client';

import type { ReactNode } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CartProvider } from '@/lib/cart';
import { WishlistProvider } from '@/lib/wishlist';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1c1917', contrastText: '#ffffff' },
    secondary: { main: '#d9a997', contrastText: '#1c1917' },
    background: { default: '#fafaf9', paper: '#ffffff' },
    text: { primary: '#1c1917', secondary: '#78716c' },
    divider: '#e7e5e4',
  },
  typography: {
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
    allVariants: { fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif" },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20 },
        contained: { '&:hover': { backgroundColor: '#44403c' } },
        outlined: { borderColor: '#d6d3d1', '&:hover': { borderColor: '#1c1917', backgroundColor: '#fafaf9' } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { '&:focus-visible': { outline: '2px solid #1c1917', outlineOffset: 2 } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: '#e7e5e4' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d6d3d1' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#78716c' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1c1917', borderWidth: 1 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { color: '#57534e', fontWeight: 600, backgroundColor: '#fafaf9' },
        root: { borderColor: '#e7e5e4' },
      },
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
