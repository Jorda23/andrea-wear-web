import { ArrowDownRight, ArrowUpRight, Box as BoxIcon, CircleDollarSign, Clock3, ShoppingBag, Users } from 'lucide-react';
import { Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { formatPrice } from '@/lib/types';
import type { OrderStatus, OrderWithItems } from '@/lib/types';

type AdminTab = 'overview' | 'products' | 'orders' | 'customers';

const statusColors: Record<OrderStatus, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
  pending: 'warning',
  confirmed: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}

export function AdminOverview({
  orders,
  customerCount,
  productCount,
  onNavigate,
}: {
  orders: OrderWithItems[];
  customerCount: number;
  productCount: number;
  onNavigate: (tab: AdminTab) => void;
}) {
  const activeOrders = orders.filter((order) => order.status !== 'cancelled');
  const revenue = activeOrders.reduce((total, order) => total + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const unitsSold = activeOrders.reduce(
    (total, order) => total + order.items.reduce((lineTotal, item) => lineTotal + item.quantity, 0),
    0,
  );

  const stats = [
    { label: 'Total revenue', value: formatPrice(revenue), helper: 'From completed store activity', icon: CircleDollarSign, tint: '#eef3e9', color: '#526747' },
    { label: 'Total orders', value: String(orders.length), helper: `${unitsSold} items sold`, icon: ShoppingBag, tint: '#f5eee7', color: '#9a6845' },
    { label: 'Awaiting fulfillment', value: String(pendingOrders), helper: 'Orders to review', icon: Clock3, tint: '#f7f1df', color: '#947b35' },
    { label: 'Customers', value: String(customerCount), helper: 'Store customers', icon: Users, tint: '#eeeaf4', color: '#74618d' },
    { label: 'Products', value: String(productCount), helper: 'Items in your catalog', icon: BoxIcon, tint: '#e8eff3', color: '#557787' },
  ];

  const today = new Date();
  const dailyRevenue = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const revenueForDay = activeOrders
      .filter((order) => new Date(order.created_at).toDateString() === date.toDateString())
      .reduce((total, order) => total + order.total, 0);
    return { label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date), date, revenue: revenueForDay };
  });
  const peakDay = Math.max(...dailyRevenue.map((day) => day.revenue), 0);

  const bestSellers = Object.values(
    activeOrders.flatMap((order) => order.items).reduce<Record<string, { name: string; quantity: number }>>((summary, item) => {
      summary[item.product_name] = {
        name: item.product_name,
        quantity: (summary[item.product_name]?.quantity ?? 0) + item.quantity,
      };
      return summary;
    }, {}),
  ).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  const topSeller = Math.max(bestSellers[0]?.quantity ?? 0, 1);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
        <Box>
          <Typography component="h2" variant="h5" fontWeight={600}>Store overview</Typography>
          <Typography color="text.secondary" variant="body2" mt={0.5}>A snapshot of your store’s performance.</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Updated {new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(today)}
        </Typography>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 205px), 1fr))', gap: 2 }}>
        {stats.map(({ label, value, helper, icon: Icon, tint, color }) => (
          <Paper key={label} variant="outlined" sx={{ p: 2.5, borderColor: 'divider', borderRadius: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="h5" fontWeight={650} mt={1}>{value}</Typography>
              </Box>
              <Box sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 2, bgcolor: tint, color }}>
                <Icon size={19} />
              </Box>
            </Stack>
            <Typography display="block" variant="caption" color="text.secondary" mt={1.5}>{helper}</Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.6fr) minmax(300px, 1fr)' }, gap: 2 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderColor: 'divider', borderRadius: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>Revenue</Typography>
              <Typography variant="caption" color="text.secondary">Daily sales over the last 7 days</Typography>
            </Box>
            <Chip size="small" label="Last 7 days" variant="outlined" />
          </Stack>
          <Box sx={{ height: 190, display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', alignItems: 'end', gap: { xs: 1, sm: 2 }, borderBottom: '1px solid', borderColor: 'divider', px: 1 }}>
            {dailyRevenue.map((day) => {
              const height = peakDay > 0 ? Math.max((day.revenue / peakDay) * 100, day.revenue > 0 ? 8 : 3) : 3;
              return (
                <Stack key={day.label + day.date.toISOString()} alignItems="center" justifyContent="flex-end" height="100%" gap={1} title={`${day.label}: ${formatPrice(day.revenue)}`}>
                  <Box sx={{ width: 'min(100%, 34px)', height: `${height}%`, minHeight: 4, bgcolor: day.revenue > 0 ? '#1c1917' : '#e7e5e4', borderRadius: '6px 6px 0 0', transition: 'height .2s ease' }} />
                </Stack>
              );
            })}
          </Box>
          <Stack direction="row" justifyContent="space-around" mt={1.2}>
            {dailyRevenue.map((day) => <Typography key={day.label + day.date.toISOString()} variant="caption" color="text.secondary">{day.label}</Typography>)}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderColor: 'divider', borderRadius: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>Best sellers</Typography>
              <Typography variant="caption" color="text.secondary">Most purchased products</Typography>
            </Box>
            <Button size="small" onClick={() => onNavigate('products')} sx={{ textTransform: 'none' }}>Products</Button>
          </Stack>
          {bestSellers.length ? (
            <Stack spacing={2.2}>
              {bestSellers.map((product, index) => (
                <Stack key={product.name} spacing={0.8}>
                  <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Typography variant="body2" noWrap>{index + 1}. {product.name}</Typography>
                    <Typography variant="body2" fontWeight={600} whiteSpace="nowrap">{product.quantity} sold</Typography>
                  </Stack>
                  <Box sx={{ height: 5, bgcolor: '#f0eeeb', borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ width: `${(product.quantity / topSeller) * 100}%`, height: '100%', bgcolor: '#8c806d', borderRadius: 5 }} />
                  </Box>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Stack minHeight={150} alignItems="center" justifyContent="center" textAlign="center">
              <Typography variant="body2" color="text.secondary">Sales will appear here once customers place orders.</Typography>
            </Stack>
          )}
        </Paper>
      </Box>

      <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={{ xs: 2, sm: 2.5 }} py={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Recent orders</Typography>
            <Typography variant="caption" color="text.secondary">Latest activity from your store</Typography>
          </Box>
          <Button size="small" onClick={() => onNavigate('orders')} sx={{ textTransform: 'none' }}>View all orders</Button>
        </Stack>
        {orders.length ? (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 620 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafaf9' }}>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{order.order_number}</TableCell>
                    <TableCell>{order.shipping_name}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell><Chip size="small" variant="outlined" color={statusColors[order.status]} label={order.status} sx={{ textTransform: 'capitalize' }} /></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{formatPrice(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Stack minHeight={120} alignItems="center" justifyContent="center" px={2}>
            <Typography variant="body2" color="text.secondary">No orders yet. New orders will show up here.</Typography>
          </Stack>
        )}
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={{ xs: 2, sm: 2.5 }} py={1.5} borderTop="1px solid" borderColor="divider">
          <Typography variant="caption" color="text.secondary">Catalog has {productCount} products</Typography>
          <Stack direction="row" gap={0.5} alignItems="center" color="text.secondary">
            {pendingOrders > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <Typography variant="caption">{pendingOrders} pending</Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

