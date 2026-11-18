import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { Check, Heart, Minus, Plus, ShoppingBag, Truck } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductImage } from '@/components/ProductImage';
import { Link, navigate } from '@/components/Link';
import { fetchProductBySlug, fetchProducts } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { effectivePrice, formatPrice, isOnSale } from '@/lib/types';
import type { Product } from '@/lib/types';

export function ProductDetailPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    setLoading(true); setNotFound(false); setSize(null); setColor(null); setQty(1); window.scrollTo(0, 0);
    fetchProductBySlug(slug).then((item) => {
      setProduct(item);
      if (!item) setNotFound(true);
      else {
        setSize(item.sizes[0] ?? null); setColor(item.colors[0] ?? null);
        return fetchProducts().then((all) => setRelated(all.filter((other) => other.id !== item.id && other.category === item.category).slice(0, 4)));
      }
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 5 }}><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 5 }}><Skeleton variant="rounded" sx={{ aspectRatio: '3 / 4' }} /><Stack spacing={2}><Skeleton width="25%" /><Skeleton height={48} width="75%" /><Skeleton width="35%" /><Skeleton height={100} /></Stack></Box></Box>;

  if (notFound || !product) return <Stack component="main" alignItems="center" textAlign="center" sx={{ py: 12, px: 2, animation: 'pageIn .35s ease both' }}><Typography variant="h1" sx={{ fontSize: 34, fontWeight: 600 }}>Product not found</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>This piece may have sold out or been removed.</Typography><Link to="/shop" sx={{ mt: 3, px: 3, py: 1.25, bgcolor: 'primary.main', color: '#fff', borderRadius: 99, textDecoration: 'none' }}>Back to shop</Link></Stack>;

  const price = effectivePrice(product); const onSale = isOnSale(product); const saved = has(product.id); const soldOut = product.stock <= 0;
  const handleAdd = () => { addItem({ productId: product.id, name: product.name, slug: product.slug, price, image_url: product.image_url, size, color, quantity: qty, maxStock: product.stock }); setAdded(true); setTimeout(() => setAdded(false), 2000); };

  return <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 5, animation: 'pageIn .35s ease both' }}>
    <Stack component="nav" direction="row" useFlexGap flexWrap="wrap" spacing={1} sx={{ mb: 4, fontSize: 13 }}>
      <Link to="/" sx={{ color: 'text.secondary' }}>Home</Link><Typography color="text.disabled">/</Typography><Link to={`/category/${product.category}`} sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{product.category}</Link><Typography color="text.disabled">/</Typography><Typography color="text.primary">{product.name}</Typography>
    </Stack>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) minmax(0,1fr)' }, gap: { xs: 4, lg: 6 } }}>
      <Box sx={{ aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: 4, bgcolor: '#f2f0ed' }}><ProductImage src={product.image_url} alt={product.name} iconSize={64} /></Box>
      <Stack spacing={3} sx={{ py: { lg: 1 } }}>
        <Box><Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '.2em' }}>{product.category}</Typography><Typography variant="h1" sx={{ mt: 0.5, fontSize: { xs: 34, sm: 42 }, lineHeight: 1.12, fontWeight: 600 }}>{product.name}</Typography>
          <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mt: 2 }}><Typography variant="h5" fontWeight={700} color={onSale ? 'error.main' : 'text.primary'}>{formatPrice(price)}</Typography>{onSale && <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>{formatPrice(product.price)}</Typography>}{onSale && <Typography variant="caption" color="error.main" sx={{ px: 1, py: 0.5, bgcolor: '#fff1f2', borderRadius: 99, fontWeight: 700 }}>Save {Math.round((1 - price / product.price) * 100)}%</Typography>}</Stack>
        </Box>
        <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>{product.description}</Typography>
        {product.sizes.length > 0 && <Box><Typography variant="overline" fontWeight={700}>Size</Typography><Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mt: 1 }}>{product.sizes.map((item) => <Button key={item} variant={size === item ? 'contained' : 'outlined'} onClick={() => setSize(item)}>{item}</Button>)}</Stack></Box>}
        {product.colors.length > 0 && <Box><Typography variant="overline" fontWeight={700}>Color</Typography><Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mt: 1 }}>{product.colors.map((item) => <Button key={item} variant={color === item ? 'contained' : 'outlined'} onClick={() => setColor(item)}>{item}</Button>)}</Stack></Box>}
        <Stack direction="row" alignItems="center" spacing={2}><Stack direction="row" alignItems="center" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}><IconButton aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}><Minus size={15} /></IconButton><Typography sx={{ minWidth: 36, textAlign: 'center', fontWeight: 600 }}>{qty}</Typography><IconButton aria-label="Increase quantity" onClick={() => setQty((value) => Math.min(product.stock, value + 1))}><Plus size={15} /></IconButton></Stack>{product.stock > 0 && product.stock <= 5 && <Typography variant="caption" color="warning.main">Only {product.stock} left in stock</Typography>}</Stack>
        <Stack direction="row" spacing={1.5}>
          <Button onClick={handleAdd} disabled={soldOut} variant="contained" fullWidth startIcon={soldOut ? undefined : added ? <Check size={17} /> : <ShoppingBag size={17} />} sx={{ py: 1.5, bgcolor: added ? 'success.dark' : undefined }}>{soldOut ? 'Sold out' : added ? 'Added to cart' : 'Add to cart'}</Button>
          <IconButton onClick={() => toggle(product.id)} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} sx={{ px: 2, border: '1px solid', borderColor: saved ? 'error.main' : 'divider', color: saved ? 'error.main' : 'text.primary', bgcolor: saved ? '#fff1f2' : 'transparent' }}><Heart size={19} fill={saved ? 'currentColor' : 'none'} /></IconButton>
        </Stack>
        {added && <Button variant="outlined" fullWidth onClick={() => navigate('/cart')}>Go to cart</Button>}
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.25, bgcolor: '#f5f5f4', color: 'text.secondary' }}><Truck size={18} /><Typography variant="body2">Free shipping on orders over $150 · 30-day easy returns</Typography></Paper>
      </Stack>
    </Box>
    {related.length > 0 && <Box component="section" sx={{ mt: 10 }}><Typography variant="h2" sx={{ mb: 3, fontSize: 28, fontWeight: 600 }}>You may also like</Typography><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: { xs: 2, sm: 3 }, '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }}>{related.map((item) => <ProductCard key={item.id} product={item} />)}</Box></Box>}
  </Box>;
}
