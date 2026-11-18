import { useEffect, useState } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { Heart } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Link } from '@/components/Link';
import { fetchProducts } from '@/lib/api';
import { useWishlist } from '@/lib/wishlist';
import type { Product } from '@/lib/types';

export function WishlistPage() {
  const { productIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false)); }, []);
  const saved = products.filter((product) => productIds.includes(product.id));

  return (
    <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 5, animation: 'pageIn .35s ease both' }}>
      <Typography variant="h1" sx={{ fontSize: { xs: 32, sm: 40 }, fontWeight: 600 }}>Wishlist</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>{saved.length === 0 ? 'Pieces you save will appear here.' : `${saved.length} saved ${saved.length === 1 ? 'piece' : 'pieces'}`}</Typography>
      {loading ? <Box sx={{ mt: 5, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: { xs: 2, sm: 3 }, '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }}>
        {Array.from({ length: 4 }).map((_, i) => <Box key={i}><Skeleton variant="rounded" sx={{ aspectRatio: '3 / 4' }} /><Skeleton width="70%" sx={{ mt: 1.5 }} /></Box>)}
      </Box> : saved.length === 0 ? <Stack alignItems="center" spacing={1} sx={{ py: 10 }}>
        <Heart size={40} color="#d6d3d1" />
        <Typography variant="h6" sx={{ mt: 1 }}>No saved pieces yet</Typography>
        <Typography color="text.secondary">Tap the heart on any product to keep it for later.</Typography>
        <Link to="/shop" sx={{ mt: 2, px: 3, py: 1.25, borderRadius: 99, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 600, textDecoration: 'none', '&:hover': { bgcolor: '#44403c' } }}>Browse the shop</Link>
      </Stack> : <Box sx={{ mt: 5, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: { xs: 2, sm: 3 }, '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }}>
        {saved.map((product) => <ProductCard key={product.id} product={product} />)}
      </Box>}
    </Box>
  );
}
