import { Box, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { Shirt } from 'lucide-react';

interface ProductImageProps {
  src: string | null;
  alt: string;
  sx?: SxProps<Theme>;
  iconSize?: number;
}

export function ProductImage({ src, alt, sx, iconSize = 40 }: ProductImageProps) {
  if (!src) {
    return (
      <Stack
        role="img"
        aria-label={alt}
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={[{ minHeight: 120, width: '100%', height: '100%', color: 'text.secondary', bgcolor: '#f2f0ed' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      >
        <Shirt size={iconSize} strokeWidth={1.25} />
        <Typography variant="caption" sx={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Image coming soon
        </Typography>
      </Stack>
    );
  }

  return <Box component="img" src={src} alt={alt} loading="lazy" sx={[{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} />;
}
