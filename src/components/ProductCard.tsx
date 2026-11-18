import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from './Link';
import { ProductImage } from './ProductImage';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { effectivePrice, formatPrice, isOnSale } from '@/lib/types';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const price = effectivePrice(product);
  const onSale = isOnSale(product);
  const saved = has(product.id);
  const soldOut = product.stock <= 0;

  return (
    <Stack spacing={1.25} sx={{ animation: 'fadeUp .5s ease both' }}>
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3, bgcolor: '#f2f0ed', aspectRatio: '3 / 4', '&:hover .MuiButton-root': { opacity: 1, transform: 'translateY(0)' }, '&:hover img': { transform: 'scale(1.04)' } }}>
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`} sx={{ display: 'block', width: '100%', height: '100%' }}>
          <ProductImage src={product.image_url} alt={product.name} iconSize={48} sx={{ transition: 'transform .4s ease' }} />
        </Link>
        <Stack spacing={0.75} sx={{ position: 'absolute', top: 12, left: 12, pointerEvents: 'none' }}>
          {onSale && <Typography variant="caption" sx={{ px: 1.25, py: 0.25, borderRadius: 99, bgcolor: 'error.main', color: '#fff', fontWeight: 700, letterSpacing: '.05em' }}>SALE</Typography>}
          {soldOut && <Typography variant="caption" sx={{ px: 1.25, py: 0.25, borderRadius: 99, bgcolor: '#292524', color: '#fff', fontWeight: 700, letterSpacing: '.05em' }}>SOLD OUT</Typography>}
        </Stack>
        <IconButton
          onClick={() => toggle(product.id)}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          sx={{ position: 'absolute', top: 10, right: 10, bgcolor: saved ? 'error.main' : 'rgba(255,255,255,.92)', color: saved ? '#fff' : 'text.primary', '&:hover': { bgcolor: saved ? 'error.dark' : '#fff' } }}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </IconButton>
        {!soldOut && (
          <Button
            type="button"
            onClick={() => addItem({ productId: product.id, name: product.name, slug: product.slug, price, image_url: product.image_url, size: product.sizes[0] ?? null, color: product.colors[0] ?? null, quantity: 1, maxStock: product.stock })}
            sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, minHeight: 42, borderRadius: 2, bgcolor: 'rgba(28,25,23,.96)', color: '#fff', fontSize: 14, opacity: { xs: 1, md: 0 }, transform: { xs: 'none', md: 'translateY(12px)' }, transition: 'all .25s ease', '&:hover': { bgcolor: '#44403c' }, '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 } }}
          >
            <ShoppingBag size={15} /> Quick add
          </Button>
        )}
      </Box>
      <Stack spacing={0.25} sx={{ px: 0.25 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontSize: 10, lineHeight: 1.5 }}>{product.category}</Typography>
        <Link to={`/product/${product.slug}`} sx={{ display: 'block', color: 'text.primary', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          {product.name}
        </Link>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="body2" fontWeight={700} color={onSale ? 'error.main' : 'text.primary'}>{formatPrice(price)}</Typography>
          {onSale && <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>{formatPrice(product.price)}</Typography>}
        </Stack>
      </Stack>
    </Stack>
  );
}
