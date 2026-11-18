import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, FormControl, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { fetchOrdersAdmin, updateOrderStatus } from '@/lib/api';
import { formatPrice, ORDER_STATUSES } from '@/lib/types';
import type { OrderStatus, OrderWithItems } from '@/lib/types';

export function AdminOrders({ adminCode }: { adminCode: string }) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchOrdersAdmin(adminCode).then(setOrders).catch(() => setError('Could not load orders. Check the access code and try again.')).finally(() => setLoading(false));
  }, [adminCode]);

  const changeStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status } : order));
    try { await updateOrderStatus(adminCode, orderId, status); }
    catch { setError('Could not update the order status.'); }
  };

  if (loading) return <Stack alignItems="center" py={8}><CircularProgress /></Stack>;

  return <Stack spacing={2.5}>
    {error && <Alert severity="error">{error}</Alert>}
    <Typography variant="body2" color="text.secondary">{orders.length} orders</Typography>
    {orders.length === 0 ? <Paper variant="outlined" sx={{ py: 8, textAlign: 'center' }}><Typography color="text.secondary">No orders yet. Orders placed at checkout appear here.</Typography></Paper> :
      <Stack spacing={1.5}>{orders.map((order) => <Paper key={order.id} variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box component="button" onClick={() => setExpanded((current) => current === order.id ? null : order.id)} aria-expanded={expanded === order.id}
          sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 2.5, border: 0, bgcolor: 'background.paper', textAlign: 'left', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
          <Stack>
            <Typography fontWeight={700}>{order.order_number}</Typography>
            <Typography variant="caption" color="text.secondary">{order.shipping_name} · {order.shipping_email} · {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography fontWeight={700}>{formatPrice(order.total)}</Typography>
            <Box component="span" sx={{ px: 1.25, py: 0.5, borderRadius: 999, bgcolor: 'action.hover', color: 'text.secondary', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{order.status}</Box>
          </Stack>
        </Box>
        {expanded === order.id && <Stack spacing={3} sx={{ p: 2.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0,1fr))' }, gap: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">Items</Typography>
              {order.items.map((item) => <Stack key={item.id} direction="row" justifyContent="space-between" gap={2}>
                <Typography variant="body2">{item.product_name}<Typography component="span" display="block" variant="caption" color="text.secondary">{[item.color, item.size].filter(Boolean).join(' · ')} × {item.quantity}</Typography></Typography>
                <Typography variant="body2" fontWeight={600}>{formatPrice(item.unit_price * item.quantity)}</Typography>
              </Stack>)}
            </Stack>
            <Stack>
              <Typography variant="overline" color="text.secondary">Shipping to</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1 }}>{[order.shipping_name, order.shipping_address, `${order.shipping_city} ${order.shipping_postal_code}`, order.shipping_country, order.shipping_phone].filter(Boolean).join('\n')}</Typography>
            </Stack>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2} sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">Subtotal {formatPrice(order.subtotal)} · Shipping {order.shipping_cost === 0 ? 'Free' : formatPrice(order.shipping_cost)}</Typography>
            <Stack direction="row" alignItems="center" gap={1}><Typography variant="body2" color="text.secondary">Update status:</Typography>
              <FormControl size="small"><Select value={order.status} onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)} sx={{ textTransform: 'capitalize' }}>
                {ORDER_STATUSES.map((status) => <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>{status}</MenuItem>)}
              </Select></FormControl>
            </Stack>
          </Stack>
        </Stack>}
      </Paper>)}</Stack>}
  </Stack>;
}
