'use client';

import { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Link } from '@/components/Link';
import { usePathname } from '@/lib/usePathname';
import { HomePage } from '@/store-pages/HomePage';
import { ShopPage } from '@/store-pages/ShopPage';
import { ProductDetailPage } from '@/store-pages/ProductDetailPage';
import { CartPage } from '@/store-pages/CartPage';
import { CheckoutPage } from '@/store-pages/CheckoutPage';
import { WishlistPage } from '@/store-pages/WishlistPage';
import { OrderTrackingPage } from '@/store-pages/OrderTrackingPage';
import { AdminPage } from '@/store-pages/AdminPage';

function Routes() {
  const path = usePathname();

  useEffect(() => {
    if (!window.location.pathname.startsWith('/order/')) window.scrollTo(0, 0);
  }, [path]);

  if (path === '/' || path === '/shop') return <HomePage />;
  if (path.startsWith('/category/')) return <ShopPage category={path.split('/')[2]} />;
  if (path.startsWith('/product/')) return <ProductDetailPage slug={path.split('/')[2] ?? ''} />;
  if (path === '/cart') return <CartPage />;
  if (path === '/checkout') return <CheckoutPage />;
  if (path === '/wishlist') return <WishlistPage />;
  if (path.startsWith('/order/')) return <OrderTrackingPage orderNumber={path.split('/')[2]} />;
  if (path === '/track') return <OrderTrackingPage />;
  if (path === '/admin') return <AdminPage />;

  return (
    <Stack component="section" alignItems="center" justifyContent="center" sx={{ py: 12, textAlign: 'center' }}>
      <Typography component="h1" variant="h4" fontWeight={700}>Page not found</Typography>
      <Link to="/" sx={{ mt: 3, px: 3, py: 1.25, borderRadius: 999, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: '#44403c' } }}>
        Back to home
      </Link>
    </Stack>
  );
}

export default function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes />
      </Box>
      <Footer />
    </Box>
  );
}
