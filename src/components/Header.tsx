import { useState } from 'react';
import { Heart, Menu, Package, ShoppingBag, X } from 'lucide-react';
import { Badge, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { Link, navigate } from './Link';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { usePathname } from '@/lib/usePathname';

const NAV_LINKS = [
  { to: '/category/women', label: 'Women' },
  { to: '/category/men', label: 'Men' },
  { to: '/category/accessories', label: 'Accessories' },
  { to: '/category/shoes', label: 'Shoes' },
];

export function Header() {
  const { count } = useCart();
  const { productIds } = useWishlist();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkSx = (to: string) => ({
    py: 1,
    fontSize: 14,
    letterSpacing: '.02em',
    color: pathname === to ? 'text.primary' : 'text.secondary',
    borderBottom: '1px solid',
    borderColor: pathname === to ? 'text.primary' : 'transparent',
    transition: 'color .2s ease, border-color .2s ease',
    '&:hover': { color: 'text.primary', borderColor: 'text.primary' },
  });

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 40, borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
      <Box aria-label="Store announcements" sx={{ overflow: 'hidden', bgcolor: '#141211', color: '#fff' }}>
        <Stack
          direction="row"
          justifyContent="center"
          spacing={{ xs: 2, sm: 6 }}
          sx={{ maxWidth: 1280, mx: 'auto', px: 2, py: 1, whiteSpace: 'nowrap' }}
        >
          <Typography variant="caption" sx={{ fontSize: { xs: 9, sm: 10 }, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' }}>
            Free shipping on orders over $100
          </Typography>
          <Typography variant="caption" sx={{ fontSize: { xs: 9, sm: 10 }, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' }}>
            No hassle returns
          </Typography>
          <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 10, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' }}>
            Thoughtfully chosen, made to last
          </Typography>
        </Stack>
      </Box>

      <Toolbar disableGutters sx={{ mx: 'auto', width: '100%', maxWidth: 1280, minHeight: '68px !important', px: { xs: 2, sm: 3, lg: 4 }, gap: 2, justifyContent: 'space-between' }}>
        <IconButton
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          sx={{ display: { xs: 'inline-flex', lg: 'none' }, color: 'text.primary' }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </IconButton>

        <Link to="/" onClick={() => setMobileOpen(false)} sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          <Typography component="span" sx={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontSize: 28, fontWeight: 700, letterSpacing: '-.04em', color: 'text.primary' }}>
            Andrea Wear
          </Typography>
        </Link>

        <Stack component="nav" aria-label="Main navigation" direction="row" spacing={{ lg: 3, xl: 4 }} sx={{ display: { xs: 'none', lg: 'flex' } }}>
          {NAV_LINKS.map((item) => (
            <Link key={item.to} to={item.to} sx={navLinkSx(item.to)}>
              {item.label}
            </Link>
          ))}
        </Stack>

        <Stack direction="row" spacing={{ xs: 0, sm: 0.5 }}>
          <IconButton onClick={() => navigate('/track')} aria-label="Track order" sx={{ color: 'text.primary' }}>
            <Package size={20} />
          </IconButton>
          <IconButton onClick={() => navigate('/wishlist')} aria-label="Wishlist" sx={{ color: 'text.primary' }}>
            <Badge badgeContent={productIds.length} color="primary"><Heart size={20} /></Badge>
          </IconButton>
          <IconButton onClick={() => navigate('/cart')} aria-label="Cart" sx={{ color: 'text.primary' }}>
            <Badge badgeContent={count} color="primary"><ShoppingBag size={20} /></Badge>
          </IconButton>
        </Stack>
      </Toolbar>

      {mobileOpen && (
        <Stack component="nav" aria-label="Mobile navigation" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.default', px: 2, py: 1.5, display: { xs: 'flex', lg: 'none' } }}>
          {NAV_LINKS.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} sx={{ py: 1.25, fontSize: 14, color: 'text.primary' }}>
              {item.label}
            </Link>
          ))}
          <Link to="/track" onClick={() => setMobileOpen(false)} sx={{ py: 1.25, fontSize: 14, color: 'text.primary' }}>
            Track order
          </Link>
        </Stack>
      )}
    </Box>
  );
}
