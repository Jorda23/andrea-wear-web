import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import { CheckCircle2, Package, PackageSearch, XCircle } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';
import { fetchOrderByNumber } from '@/lib/api';
import { formatPrice } from '@/lib/types';
import type { OrderStatus, OrderWithItems } from '@/lib/types';

const TRACK_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Order placed' }, { key: 'confirmed', label: 'Confirmed' }, { key: 'shipped', label: 'Shipped' }, { key: 'delivered', label: 'Delivered' },
];

export function OrderTrackingPage({ orderNumber }: { orderNumber?: string }) {
  const [input, setInput] = useState(orderNumber ?? '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookup, setLookup] = useState<{ orderNumber: string; email: string } | null>(null);
  useEffect(() => {
    if (!lookup) return;
    setLoading(true); setError(null);
    fetchOrderByNumber(lookup.orderNumber, lookup.email).then((result) => { setOrder(result); if (!result) setError('We could not find an order with that number. Double-check and try again.'); }).catch(() => setError('Something went wrong while looking up your order.')).finally(() => setLoading(false));
  }, [lookup]);
  const currentStep = order ? TRACK_STEPS.findIndex((step) => step.key === order.status) : -1;
  const cancelled = order?.status === 'cancelled';

  return <Box component="main" sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, py: 5, animation: 'pageIn .35s ease both' }}>
    <Stack direction="row" alignItems="center" spacing={1.5}><PackageSearch size={28} /><Typography variant="h1" sx={{ fontSize: { xs: 32, sm: 40 }, fontWeight: 600 }}>Track your order</Typography></Stack>
    <Box component="form" onSubmit={(event) => { event.preventDefault(); if (input.trim() && email.trim()) { setOrder(null); setLookup({ orderNumber: input.trim().toUpperCase(), email: email.trim() }); } }} sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr auto' }, gap: 1.5 }}>
      <TextField value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter order number, e.g. ST-XXXXX" inputProps={{ 'aria-label': 'Order number', style: { textTransform: 'uppercase' } }} />
      <TextField type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Checkout email" inputProps={{ 'aria-label': 'Checkout email' }} />
      <Button type="submit" variant="contained" sx={{ px: 3, minHeight: 56 }}>Track</Button>
    </Box>
    {loading && <Stack alignItems="center" sx={{ mt: 8 }}><CircularProgress size={30} /></Stack>}
    {error && !loading && <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>}
    {order && !loading && <Stack spacing={2.5} sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
          <Box><Typography variant="overline" color="text.secondary">Order</Typography><Typography variant="h5" fontWeight={700}>{order.order_number}</Typography><Typography variant="caption" color="text.secondary">Placed {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography></Box>
          {cancelled ? <Chip color="error" icon={<XCircle size={15} />} label="Cancelled" /> : <Chip color="success" icon={<CheckCircle2 size={15} />} label={order.status} sx={{ textTransform: 'capitalize' }} />}
        </Stack>
        {!cancelled && <Stepper activeStep={Math.max(currentStep, 0)} alternativeLabel sx={{ mt: 4, '& .MuiStepLabel-label': { fontSize: { xs: 10, sm: 12 } }, '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': { color: 'success.main' } }}>{TRACK_STEPS.map((step) => <Step key={step.key}><StepLabel>{step.label}</StepLabel></Step>)}</Stepper>}
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="subtitle1" fontWeight={700}>Items</Typography>
        <Stack component="ul" spacing={2} sx={{ listStyle: 'none', p: 0, my: 2 }}>
          {order.items.map((item) => <Stack component="li" key={item.id} direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 56, height: 64, flexShrink: 0, overflow: 'hidden', borderRadius: 2, bgcolor: '#f2f0ed' }}><ProductImage src={null} alt={item.product_name} iconSize={20} /></Box>
            <Box sx={{ flex: 1 }}><Typography variant="body2" fontWeight={600}>{item.product_name}</Typography><Typography variant="caption" color="text.secondary">{[item.color, item.size].filter(Boolean).join(' · ')} × {item.quantity}</Typography></Box>
            <Typography variant="body2" fontWeight={700}>{formatPrice(item.unit_price * item.quantity)}</Typography>
          </Stack>)}
        </Stack>
        <Stack component="dl" spacing={1} sx={{ mt: 2, pt: 2, m: 0, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack component="div" direction="row" justifyContent="space-between"><Typography component="dt" color="text.secondary">Subtotal</Typography><Typography component="dd" sx={{ m: 0 }}>{formatPrice(order.subtotal)}</Typography></Stack>
          <Stack component="div" direction="row" justifyContent="space-between"><Typography component="dt" color="text.secondary">Shipping</Typography><Typography component="dd" sx={{ m: 0 }}>{order.shipping_cost === 0 ? 'Free' : formatPrice(order.shipping_cost)}</Typography></Stack>
          <Stack component="div" direction="row" justifyContent="space-between"><Typography component="dt" fontWeight={700}>Total</Typography><Typography component="dd" sx={{ m: 0, fontWeight: 700 }}>{formatPrice(order.total)}</Typography></Stack>
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}><Package size={18} /><Typography variant="body2" color="text.secondary">Shipping to <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{order.shipping_name}</Box>, {order.shipping_address}, {order.shipping_city} {order.shipping_postal_code}, {order.shipping_country}</Typography></Paper>
    </Stack>}
  </Box>;
}
