import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, MenuItem, Paper, Skeleton, Slider, Stack, TextField, Typography } from '@mui/material';
import { SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { CATEGORIES, effectivePrice } from '@/lib/types';
import type { Product } from '@/lib/types';

interface ShopPageProps { category?: string }

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'name', label: 'Name: A to Z' },
];

export function ShopPage({ category }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState('featured');
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts().then(setProducts).catch(() => setError('We could not load the catalog. Please refresh to try again.')).finally(() => setLoading(false));
  }, []);

  const allSizes = useMemo(() => [...new Set(products.flatMap((p) => p.sizes))], [products]);
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors))], [products]);
  const filtered = useMemo(() => {
    let list = category ? products.filter((p) => p.category === category) : products;
    if (sizeFilter) list = list.filter((p) => p.sizes.includes(sizeFilter));
    if (colorFilter) list = list.filter((p) => p.colors.includes(colorFilter));
    if (maxPrice !== null) list = list.filter((p) => effectivePrice(p) <= maxPrice);
    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b));
      case 'price-desc': return [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a));
      case 'name': return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default: return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [products, category, sizeFilter, colorFilter, maxPrice, sort]);
  const heading = category ? CATEGORIES.find((c) => c.value === category)?.label ?? category : 'All products';
  const hasFilters = Boolean(sizeFilter || colorFilter || maxPrice !== null);

  return (
    <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 5, animation: 'pageIn .35s ease both' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-end' }} justifyContent="space-between" spacing={2.5} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: 32, sm: 40 }, fontWeight: 600 }}>{heading}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`}</Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button onClick={() => setShowFilters((v) => !v)} variant={showFilters || hasFilters ? 'contained' : 'outlined'} startIcon={<SlidersHorizontal size={16} />}>
            Filters
          </Button>
          <TextField select size="small" label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 175 }}>
            {SORTS.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
        </Stack>
      </Stack>

      {showFilters && <Paper variant="outlined" sx={{ mb: 4, p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' } }}>
          <Box>
            <Typography variant="overline" fontWeight={700}>Size</Typography>
            <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
              {allSizes.map((size) => <Button key={size} size="small" variant={sizeFilter === size ? 'contained' : 'outlined'} onClick={() => setSizeFilter((prev) => prev === size ? null : size)}>{size}</Button>)}
            </Stack>
          </Box>
          <Box>
            <Typography variant="overline" fontWeight={700}>Color</Typography>
            <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
              {allColors.map((color) => <Button key={color} size="small" variant={colorFilter === color ? 'contained' : 'outlined'} onClick={() => setColorFilter((prev) => prev === color ? null : color)}>{color}</Button>)}
            </Stack>
          </Box>
          <Box>
            <Typography variant="overline" fontWeight={700}>Max price: {maxPrice === null ? 'any' : `$${maxPrice}`}</Typography>
            <Slider min={50} max={350} step={10} value={maxPrice ?? 350} onChange={(_, value) => { const amount = value as number; setMaxPrice(amount >= 350 ? null : amount); }} aria-label="Maximum price" sx={{ mt: 1 }} />
            {hasFilters && <Button color="error" size="small" onClick={() => { setSizeFilter(null); setColorFilter(null); setMaxPrice(null); }}>Clear all filters</Button>}
          </Box>
        </Box>
      </Paper>}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading ? <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: { xs: 2, sm: 3 }, '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' } }}>
        {Array.from({ length: 8 }).map((_, i) => <Box key={i}><Skeleton variant="rounded" sx={{ aspectRatio: '3 / 4' }} /><Skeleton width="70%" sx={{ mt: 1.5 }} /><Skeleton width="40%" /></Box>)}
      </Box> : filtered.length === 0 ? <Stack alignItems="center" spacing={0.5} sx={{ py: 10 }}>
        <Typography variant="h6">No pieces match your filters.</Typography><Typography color="text.secondary">Try removing a filter or browsing everything.</Typography>
      </Stack> : <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: { xs: 2, sm: 3 }, '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' } }}>
        {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
      </Box>}
    </Box>
  );
}
