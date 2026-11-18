import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import { CheckCircle2, Lock } from 'lucide-react';
import { navigate } from '@/components/Link';
import { placeOrder } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/types';
import type { CustomerDraft } from '@/lib/types';

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const shipping = subtotal >= 150 ? 0 : 12;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerDraft>({ name: '', email: '', phone: '', address_line1: '', city: '', postal_code: '', country: '' });
  const set = (key: keyof CustomerDraft) => (event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [key]: event.target.value }));

  if (items.length === 0 && !submitting) return <Stack component="main" alignItems="center" textAlign="center" sx={{ py: 12, px: 2, animation: 'pageIn .35s ease both' }}><Typography variant="h1" sx={{ fontSize: 34, fontWeight: 600 }}>Nothing to check out</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Your cart is empty.</Typography><Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/shop')}>Start shopping</Button></Stack>;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(null); setSubmitting(true);
    try {
      const order = await placeOrder({ customer: form, items: items.map((item) => ({ productId: item.productId, name: item.name, price: item.price, size: item.size, color: item.color, quantity: item.quantity })), subtotal, shippingCost: shipping });
      clear(); navigate(`/order/${order.order_number}`);
    } catch {
      setError('We could not place your order. Please check your connection and try again.'); setSubmitting(false);
    }
  };

  return <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 5, animation: 'pageIn .35s ease both' }}>
    <Typography variant="h1" sx={{ fontSize: { xs: 32, sm: 40 }, fontWeight: 600 }}>Checkout</Typography>
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,2fr) minmax(280px,1fr)' } }}>
      <Stack spacing={2.5}>
        <Paper component="fieldset" variant="outlined" sx={{ m: 0, p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Typography component="legend" variant="overline" fontWeight={700} sx={{ px: 1 }}>Contact</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField required label="Full name" value={form.name} onChange={set('name')} placeholder="Jane Smith" />
            <TextField required type="email" label="Email" value={form.email} onChange={set('email')} placeholder="jane@example.com" />
            <TextField label="Phone" value={form.phone} onChange={set('phone')} placeholder="+1 555 000 1234" sx={{ gridColumn: { sm: '1 / -1' } }} />
          </Box>
        </Paper>
        <Paper component="fieldset" variant="outlined" sx={{ m: 0, p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Typography component="legend" variant="overline" fontWeight={700} sx={{ px: 1 }}>Shipping address</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField required label="Street address" value={form.address_line1} onChange={set('address_line1')} placeholder="123 Maple Street" sx={{ gridColumn: { sm: '1 / -1' } }} />
            <TextField required label="City" value={form.city} onChange={set('city')} placeholder="New York" />
            <TextField required label="Postal code" value={form.postal_code} onChange={set('postal_code')} placeholder="10001" />
            <TextField required label="Country" value={form.country} onChange={set('country')} placeholder="United States" sx={{ gridColumn: { sm: '1 / -1' } }} />
          </Box>
        </Paper>
        <Paper component="fieldset" variant="outlined" sx={{ m: 0, p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Typography component="legend" variant="overline" fontWeight={700} sx={{ px: 1 }}>Payment</Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 2, mt: 1, bgcolor: '#fafaf9', borderRadius: 2 }}><Lock size={17} /><Typography variant="body2" color="text.secondary">This demo store does not process real payments. Placing the order confirms it directly — no card needed.</Typography></Stack>
        </Paper>
      </Stack>
      <Paper variant="outlined" sx={{ p: 3, height: 'fit-content', position: { lg: 'sticky' }, top: { lg: 96 } }}>
        <Typography variant="h6" fontWeight={700}>Your order</Typography>
        <Stack component="ul" spacing={1.5} sx={{ mt: 2, p: 0, listStyle: 'none' }}>
          {items.map((item) => <Stack component="li" key={`${item.productId}-${item.size}-${item.color}`} direction="row" justifyContent="space-between" gap={2}><Box><Typography variant="body2" color="text.secondary">{item.name} × {item.quantity}</Typography><Typography variant="caption" color="text.disabled">{[item.color, item.size].filter(Boolean).join(' · ')}</Typography></Box><Typography variant="body2" fontWeight={600}>{formatPrice(item.price * item.quantity)}</Typography></Stack>)}
        </Stack>
        <Stack component="dl" spacing={1.5} sx={{ mt: 2.5, pt: 2, m: 0, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack component="div" direction="row" justifyContent="space-between"><Typography component="dt" color="text.secondary">Subtotal</Typography><Typography component="dd" sx={{ m: 0, fontWeight: 600 }}>{formatPrice(subtotal)}</Typography></Stack>
          <Stack component="div" direction="row" justifyContent="space-between"><Typography component="dt" color="text.secondary">Shipping</Typography><Typography component="dd" sx={{ m: 0, fontWeight: 600 }}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</Typography></Stack>
          <Stack component="div" direction="row" justifyContent="space-between" sx={{ pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}><Typography component="dt" fontWeight={700}>Total</Typography><Typography component="dd" sx={{ m: 0, fontWeight: 700 }}>{formatPrice(subtotal + shipping)}</Typography></Stack>
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button type="submit" disabled={submitting} variant="contained" fullWidth sx={{ mt: 2.5, py: 1.3 }} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}>{submitting ? 'Placing order…' : 'Place order'}</Button>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.75} sx={{ mt: 1.5 }}><CheckCircle2 size={14} /><Typography variant="caption" color="text.secondary">You will receive an order number to track delivery.</Typography></Stack>
      </Paper>
    </Box>
  </Box>;
}
