import { BarChart3, Box as BoxIcon, ShoppingCart, Users } from 'lucide-react';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Link } from '@/components/Link';

const TABS = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'products', label: 'Products', icon: BoxIcon },
  { key: 'orders', label: 'Orders', icon: ShoppingCart },
  { key: 'customers', label: 'Customers', icon: Users },
] as const;

export function AdminShell({
  tab,
  onTab,
  children,
}: {
  tab: string;
  onTab: (key: (typeof TABS)[number]['key']) => void;
  children: React.ReactNode;
}) {
  return (
    <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" gap={2}>
        <Box>
          <Typography component="h1" variant="h4" fontWeight={700} letterSpacing="-.03em">Admin dashboard</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Manage products, orders, and customers.</Typography>
        </Box>
        <Stack direction="row" alignItems="center" gap={2}>
          <Link to="/" sx={{ color: 'text.secondary', fontSize: 13, fontWeight: 500, '&:hover': { color: 'text.primary' } }}>
            View storefront
          </Link>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ mt: 4, p: 0.5, bgcolor: 'rgba(231,229,228,.5)', borderRadius: 3 }}>
        <Tabs value={tab} onChange={(_, value: (typeof TABS)[number]['key']) => onTab(value)} variant="scrollable" allowScrollButtonsMobile aria-label="Admin sections"
          sx={{ minHeight: 42, '& .MuiTabs-indicator': { display: 'none' }, '& .MuiTab-root': { minHeight: 42, minWidth: 120, borderRadius: 2, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }, '& .Mui-selected': { color: 'text.primary !important', bgcolor: 'background.paper', boxShadow: 1 } }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            return <Tab key={t.key} value={t.key} icon={<Icon size={16} />} iconPosition="start" label={t.label} />;
          })}
        </Tabs>
      </Paper>

      <Box mt={4}>{children}</Box>
    </Box>
  );
}

export { TABS };
