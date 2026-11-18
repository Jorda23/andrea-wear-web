import type { MouseEventHandler, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';

interface LinkProps {
  to: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function Link({ to, children, sx, onClick }: LinkProps) {
  return (
    <MuiLink
      component={NextLink}
      href={to}
      onClick={onClick}
      underline="none"
      color="inherit"
      sx={sx}
    >
      {children}
    </MuiLink>
  );
}
