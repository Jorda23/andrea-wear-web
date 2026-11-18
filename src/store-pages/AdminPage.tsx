import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { fetchCustomersAdmin, fetchOrdersAdmin, fetchProducts } from '@/lib/api';
import { AdminShell, TABS } from './AdminShell';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';

export function AdminPage() {
  // The current API helpers accept this argument for compatibility, but do not use it.
  const adminCode = '';
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('overview');

  const [orders, setOrders] = useState<Parameters<typeof AdminOverview>[0]['orders']>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchOrdersAdmin(adminCode), fetchCustomersAdmin(adminCode), fetchProducts({ includeInactive: true })])
      .then(([o, c, p]) => {
        setOrders(o);
        setCustomerCount(c.length);
        setProductCount(p.length);
      })
      .catch(() => {
        setError('The panel is open, but the API did not return admin data. It may still require a server-side admin session.');
      });
  }, []);

  return (
    <AdminShell tab={tab} onTab={setTab}>
      {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}
      {tab === 'overview' && (
        <AdminOverview orders={orders} customerCount={customerCount} productCount={productCount} onNavigate={setTab} />
      )}
      {tab === 'products' && <AdminProducts adminCode={adminCode} />}
      {tab === 'orders' && <AdminOrders adminCode={adminCode} />}
      {tab === 'customers' && <AdminCustomers adminCode={adminCode} />}
    </AdminShell>
  );
}
