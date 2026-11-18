import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductImage } from '@/components/ProductImage';
import { Link } from '@/components/Link';
import { fetchProducts } from '@/lib/api';
import { CATEGORIES, effectivePrice } from '@/lib/types';
import type { Product } from '@/lib/types';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => { fetchProducts().then(setProducts).catch(() => setError('We could not load the catalog. Please refresh to try again.')).finally(() => setLoading(false)); }, []);
  const featured = useMemo(() => products.filter((product) => product.featured).slice(0, 4), [products]);
  const slides = useMemo(() => (featured.length ? featured : products).slice(0, 4), [featured, products]);
  const hero = slides.length ? slides[activeSlide % slides.length] : null;

  return <Box component="main" sx={{ animation: 'pageIn .35s ease both' }}>
    {error && <Box sx={{ maxWidth: 1280, mx: 'auto', mt: 3, px: { xs: 2, sm: 3, lg: 4 } }}><Alert severity="error">{error}</Alert></Box>}
    <Box component="section" aria-label="Featured collection" sx={{ bgcolor: '#fff', py: { xs: 3, sm: 5 } }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 1.5, sm: 3, lg: 5 } }}>
        <Box sx={{ position: 'relative', minHeight: { xs: 430, sm: 500, lg: 560 }, overflow: 'hidden', borderRadius: 4, bgcolor: '#f2d7cc' }}>
          {hero?.image_url && <Box component="img" src={hero.image_url} alt={hero.name} sx={{ position: 'absolute', insetBlock: 0, right: 0, width: { xs: '100%', sm: '58%' }, height: '100%', objectFit: 'cover', objectPosition: 'center' }} />}
          <Box sx={{ position: 'absolute', inset: 0, background: { xs: 'linear-gradient(90deg, rgba(242,215,204,.98) 0%, rgba(242,215,204,.84) 55%, rgba(242,215,204,.25) 100%)', sm: 'linear-gradient(90deg, #f2d7cc 0%, rgba(242,215,204,.95) 42%, rgba(242,215,204,.12) 100%)' } }} />
          <Stack sx={{ position: 'relative', zIndex: 1, minHeight: { xs: 430, sm: 500, lg: 560 }, maxWidth: 650, alignItems: 'flex-start', justifyContent: 'center', px: { xs: 3, sm: 6, lg: 10 }, py: 7 }}>
            <Typography variant="overline" fontWeight={700} sx={{ mb: 1, letterSpacing: '.15em', color: '#57534e' }}>Andrea Wear · New season</Typography>
            <Typography component="h1" sx={{ maxWidth: 560, fontSize: { xs: 42, sm: 58, lg: 72 }, fontWeight: 750, lineHeight: 1.06, letterSpacing: '-.045em', color: '#1c1917' }}>{hero ? `Find your feel in ${hero.name}.` : 'Wear what feels like you.'}</Typography>
            <Typography sx={{ mt: 2.5, maxWidth: 420, fontSize: { xs: 14, sm: 16 }, lineHeight: 1.7, color: '#57534e' }}>Thoughtful pieces for the everyday, made to move with your life.</Typography>
            <Link to={hero ? `/product/${hero.slug}` : '/shop'} sx={{ mt: 3.5, display: 'inline-flex', alignItems: 'center', gap: 1, minHeight: 48, px: 3.5, borderRadius: 99, bgcolor: '#111', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', '&:hover': { bgcolor: '#44403c' } }}>Shop now <ArrowRight size={16} /></Link>
          </Stack>
          {slides.length > 1 && <Stack direction="row" spacing={1} sx={{ position: 'absolute', zIndex: 2, right: { xs: 2, sm: 3 }, bottom: { xs: 2, sm: 3 } }}>
            <Button aria-label="Previous featured item" onClick={() => setActiveSlide((index) => (index - 1 + slides.length) % slides.length)} sx={{ minWidth: 40, width: 40, height: 40, p: 0, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.92)', color: 'text.primary' }}><ArrowLeft size={17} /></Button>
            <Button aria-label="Next featured item" onClick={() => setActiveSlide((index) => (index + 1) % slides.length)} sx={{ minWidth: 40, width: 40, height: 40, p: 0, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.92)', color: 'text.primary' }}><ArrowRight size={17} /></Button>
          </Stack>}
        </Box>
        {slides.length > 1 && <Stack direction="row" role="group" aria-label="Choose featured item" justifyContent="center" spacing={1} sx={{ mt: 2.5 }}>
          {slides.map((slide, index) => <Button key={slide.id} aria-label={`Show ${slide.name}`} aria-current={index === activeSlide ? 'true' : undefined} onClick={() => setActiveSlide(index)} sx={{ minWidth: index === activeSlide ? 28 : 10, width: index === activeSlide ? 28 : 10, height: 10, p: 0, borderRadius: 99, bgcolor: index === activeSlide ? '#1c1917' : '#d6d3d1', '&:hover': { bgcolor: index === activeSlide ? '#1c1917' : '#a8a29e' } }} />)}
        </Stack>}
      </Box>
    </Box>

    <Box component="section" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 7 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 2, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }}>
        {CATEGORIES.map((category, index) => {
          const categoryProduct = products.find((product) => product.category === category.value);
          return <Link key={category.value} to={`/category/${category.value}`} sx={{ position: 'relative', display: 'block', overflow: 'hidden', aspectRatio: '4 / 5', borderRadius: 3, bgcolor: '#e7e5e4', animation: `fadeUp .5s ease ${index * .07}s both`, '&:hover img': { transform: 'scale(1.04)' } }}>
            {categoryProduct?.image_url ? <Box component="img" src={categoryProduct.image_url} alt={category.label} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }} /> : <Stack sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f5f5f4,#e7e5e4)' }}><Typography variant="h5" color="text.secondary">{category.label}</Typography></Stack>}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'absolute', insetInline: 0, bottom: 0, px: 2, pt: 5, pb: 1.5, color: '#fff', background: 'linear-gradient(transparent,rgba(28,25,23,.75))' }}><Typography fontWeight={700}>{category.label}</Typography><ArrowRight size={17} /></Stack>
          </Link>;
        })}
      </Box>
    </Box>

    <Box component="section" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, pb: 4 }}>
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box><Typography variant="h2" sx={{ fontSize: 30, fontWeight: 600 }}>Featured pieces</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Hand-picked favorites from this season.</Typography></Box>
        <Link to="/shop" sx={{ display: { xs: 'none', sm: 'inline-flex' }, alignItems: 'center', gap: 0.75, color: 'text.primary', textDecoration: 'none' }}>View all <ArrowRight size={15} /></Link>
      </Stack>
      {loading ? <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: { xs: 2, sm: 3 }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }}>{Array.from({ length: 4 }).map((_, index) => <Box key={index}><Skeleton variant="rounded" sx={{ aspectRatio: '3 / 4' }} /><Skeleton width="70%" sx={{ mt: 1.5 }} /><Skeleton width="40%" /></Box>)}</Box> : featured.length > 0 ? <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: { xs: 2, sm: 3 }, '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }}>{featured.map((product) => <ProductCard key={product.id} product={product} />)}</Box> : <Typography color="text.secondary" textAlign="center" sx={{ py: 6 }}>The catalog is empty. Add products from the admin dashboard to see them here.</Typography>}
    </Box>

    {hero && <Box component="section" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 7 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, overflow: 'hidden', borderRadius: 4, bgcolor: '#1c1917' }}>
        <Box sx={{ aspectRatio: { xs: '4 / 3', md: 'auto' }, minHeight: { md: 360 } }}><ProductImage src={hero.image_url} alt={hero.name} iconSize={56} /></Box>
        <Stack spacing={2} justifyContent="center" sx={{ p: { xs: 3, md: 6 }, color: '#fff' }}><Typography variant="overline" color="text.secondary" sx={{ color: '#a8a29e', letterSpacing: '.2em' }}>Piece of the week</Typography><Typography variant="h2" sx={{ fontSize: 32, fontWeight: 600 }}>{hero.name}</Typography><Typography variant="body2" sx={{ color: '#d6d3d1', lineHeight: 1.8 }}>{hero.description}</Typography><Typography variant="h5" fontWeight={700}>{effectivePrice(hero) ? `$${effectivePrice(hero).toFixed(2)}` : ''}</Typography><Link to={`/product/${hero.slug}`} sx={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 1, px: 3, py: 1.25, borderRadius: 99, bgcolor: '#fff', color: '#1c1917', fontWeight: 700, textDecoration: 'none' }}>Shop now <ArrowRight size={16} /></Link></Stack>
      </Box>
    </Box>}
  </Box>;
}
