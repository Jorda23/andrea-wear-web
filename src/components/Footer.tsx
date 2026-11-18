import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Link } from './Link';

const FOOTER_LINKS = {
  Shop: [
    { to: '/category/women', label: 'Women' },
    { to: '/category/men', label: 'Men' },
    { to: '/category/accessories', label: 'Accessories' },
    { to: '/category/shoes', label: 'Shoes' },
  ],
  Support: [
    { to: '/track', label: 'Track your order' },
    { to: '/admin', label: 'Admin dashboard' },
  ],
};

export function Footer() {
  return (
    <Box component="footer" sx={{ mt: 12, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 4 },
          py: 7,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', lg: '1.3fr 1fr 1fr 1.4fr' },
          gap: { xs: 4, md: 6 },
        }}
      >
        <Stack spacing={1.5}>
          <Typography sx={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
            Andrea Wear
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Fashion meets simplicity, style, and convenience. Thoughtfully made pieces for every day.
          </Typography>
        </Stack>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <Stack key={heading} component="nav" aria-label={`${heading} links`} spacing={1.25}>
            <Typography variant="overline" sx={{ color: 'text.primary', fontWeight: 700, letterSpacing: '.14em', lineHeight: 1.5 }}>
              {heading}
            </Typography>
            {links.map((item) => (
              <Link key={item.to} to={item.to} sx={{ width: 'fit-content', fontSize: 14, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                {item.label}
              </Link>
            ))}
          </Stack>
        ))}

        <Stack spacing={1.25}>
          <Typography variant="overline" sx={{ color: 'text.primary', fontWeight: 700, letterSpacing: '.14em', lineHeight: 1.5 }}>
            Newsletter
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New arrivals and private sales, straight to your inbox.
          </Typography>
          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              event.currentTarget.reset();
              alert('Thank you for subscribing.');
            }}
            sx={{ display: 'flex', gap: 1, pt: 0.5 }}
          >
            <TextField
              type="email"
              required
              fullWidth
              size="small"
              placeholder="Email address"
              inputProps={{ 'aria-label': 'Email address' }}
            />
            <Button type="submit" variant="contained" sx={{ minWidth: 76 }}>
              Join
            </Button>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ borderTop: 1, borderColor: 'divider', py: 2.5, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Andrea Wear. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
