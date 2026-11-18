import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { Link, navigate } from '@/components/Link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/types';

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 12;

  if (items.length === 0) return (
    <Stack component="main" alignItems="center" textAlign="center" sx={{ py: 12, px: 2, animation: 'pageIn .35s ease both' }}>
      <Typography variant="h1" sx={{ fontSize: { xs: 30, sm: 36 }, fontWeight: 600 }}>Your cart is empty</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>Discover pieces you will love in our collections.</Typography>
      <Link to="/shop" sx={{ mt: 3, px: 3, py: 1.25, borderRadius: 99, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 600, textDecoration: 'none', '&:hover': { bgcolor: '#44403c' } }}>Start shopping</Link>
    </Stack>
  );

  return (
    <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 5, animation: 'pageIn .35s ease both' }}>
      <Typography variant="h1" sx={{ fontSize: { xs: 32, sm: 40 }, fontWeight: 600 }}>Shopping cart</Typography>
      <Box sx={{ mt: 4, display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,2fr) minmax(280px,1fr)' } }}>
        <Stack spacing={2}>
          {items.map((item) => <Paper key={`${item.productId}-${item.size}-${item.color}`} variant="outlined" sx={{ display: 'flex', gap: 2, p: 2 }}>
            <Link to={`/product/${item.slug}`} sx={{ width: 96, height: 112, flexShrink: 0, overflow: 'hidden', borderRadius: 2, bgcolor: '#f2f0ed' }}>
              <ProductImage src={item.image_url} alt={item.name} iconSize={28} />
            </Link>
            <Stack flex={1} justifyContent="space-between" minWidth={0}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
                <Box>
                  <Link to={`/product/${item.slug}`} sx={{ color: 'text.primary', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>{item.name}</Link>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>{[item.color, item.size].filter(Boolean).join(' · ')}</Typography>
                </Box>
                <IconButton onClick={() => removeItem(item.productId, item.size, item.color)} aria-label={`Remove ${item.name}`} size="small" color="error"><Trash2 size={17} /></IconButton>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <IconButton onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} aria-label="Decrease quantity" size="small"><Minus size={14} /></IconButton>
                  <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</Typography>
                  <IconButton onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} aria-label="Increase quantity" size="small"><Plus size={14} /></IconButton>
                </Stack>
                <Typography fontWeight={700}>{formatPrice(item.price * item.quantity)}</Typography>
              </Stack>
            </Stack>
          </Paper>)}
          <Button color="error" size="small" onClick={clear} sx={{ alignSelf: 'flex-start' }}>Clear cart</Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3, height: 'fit-content', position: { lg: 'sticky' }, top: { lg: 96 } }}>
          <Typography variant="h6" fontWeight={700}>Order summary</Typography>
          <Stack component="dl" spacing={1.5} sx={{ mt: 2.5, m: 0 }}>
            <Stack component="div" direction="row" justifyContent="space-between"><Typography component="dt" color="text.secondary">Subtotal</Typography><Typography component="dd" sx={{ m: 0, fontWeight: 600 }}>{formatPrice(subtotal)}</Typography></Stack>
            <Stack component="div" direction="row" justifyContent="space-between"><Typography component="dt" color="text.secondary">Shipping</Typography><Typography component="dd" sx={{ m: 0, fontWeight: 600 }}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</Typography></Stack>
            <Stack component="div" direction="row" justifyContent="space-between" sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}><Typography component="dt" fontWeight={700}>Total</Typography><Typography component="dd" sx={{ m: 0, fontWeight: 700 }}>{formatPrice(subtotal + shipping)}</Typography></Stack>
          </Stack>
          {shipping > 0 && <Typography variant="caption" sx={{ display: 'block', mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#f5f5f4', color: 'text.secondary' }}>Add {formatPrice(150 - subtotal)} more for free shipping.</Typography>}
          <Button variant="contained" fullWidth onClick={() => navigate('/checkout')} sx={{ mt: 2.5, py: 1.3 }}>Proceed to checkout</Button>
          <Link to="/shop" sx={{ display: 'block', mt: 1.5, textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>Continue shopping</Link>
        </Paper>
      </Box>
    </Box>
  );
}
