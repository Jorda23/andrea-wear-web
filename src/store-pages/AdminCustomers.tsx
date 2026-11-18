import { useEffect, useState } from 'react';
import { Alert, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { fetchCustomersAdmin, fetchOrdersAdmin } from '@/lib/api';
import { formatPrice } from '@/lib/types';
import type { OrderWithItems } from '@/lib/types';

interface CustomerRow {
  id: string; name: string; email: string; phone: string | null; address_line1: string; city: string; postal_code: string; country: string; created_at: string;
}

export function AdminCustomers({ adminCode }: { adminCode: string }) {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchCustomersAdmin(adminCode), fetchOrdersAdmin(adminCode)]).then(([customerRows, orderRows]) => {
      setCustomers(customerRows); setOrders(orderRows);
    }).catch(() => setError('Could not load customers.')).finally(() => setLoading(false));
  }, [adminCode]);

  if (loading) return <Stack alignItems="center" py={8}><CircularProgress /></Stack>;
  return <Stack spacing={2.5}>
    {error && <Alert severity="error">{error}</Alert>}
    <Typography variant="body2" color="text.secondary">{customers.length} customers</Typography>
    {customers.length === 0 ? <Paper variant="outlined" sx={{ py: 8, textAlign: 'center' }}><Typography color="text.secondary">No customers yet. They are created automatically when an order is placed.</Typography></Paper> :
      <TableContainer component={Paper} variant="outlined"><Table size="small">
        <TableHead><TableRow><TableCell>Customer</TableCell><TableCell>Location</TableCell><TableCell>Orders</TableCell><TableCell>Spent</TableCell><TableCell>Joined</TableCell></TableRow></TableHead>
        <TableBody>{customers.map((customer) => {
          const mine = orders.filter((order) => order.shipping_email.toLowerCase() === customer.email.toLowerCase());
          const spent = mine.reduce((sum, order) => sum + order.total, 0);
          return <TableRow key={customer.id} hover>
            <TableCell><Stack><Typography variant="body2" fontWeight={600}>{customer.name}</Typography><Typography variant="caption" color="text.secondary">{customer.email}</Typography></Stack></TableCell>
            <TableCell>{customer.city}, {customer.country}</TableCell>
            <TableCell>{mine.length}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{formatPrice(spent)}</TableCell>
            <TableCell>{new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
          </TableRow>;
        })}</TableBody>
      </Table></TableContainer>}
  </Stack>;
}
