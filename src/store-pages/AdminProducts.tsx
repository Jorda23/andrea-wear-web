import { useEffect, useState } from 'react';
import { Check, Plus, Star, Trash2, X } from 'lucide-react';
import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { adminDeleteProduct, adminSetProductActive, adminUpsertProduct, fetchProducts } from '@/lib/api';
import { formatPrice } from '@/lib/types';
import type { Product } from '@/lib/types';
import type { ProductDraft } from '@/lib/api';

const EMPTY_DRAFT: ProductDraft = { name: '', slug: '', description: '', price: 0, sale_price: null, category: 'women', colors: [], sizes: [], stock: 0, image_url: null, featured: false, active: true };

export function AdminProducts({ adminCode }: { adminCode: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProductDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProducts({ includeInactive: true }).then(setProducts).catch(() => setError('Could not load products.')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try { await adminUpsertProduct(adminCode, editing); setEditing(null); load(); }
    catch { setError('Could not save the product. Check the values and try again.'); }
    finally { setSaving(false); }
  };
  const remove = async (product: Product) => {
    if (!confirm(`Delete "${product.name}" permanently?`)) return;
    try { await adminDeleteProduct(adminCode, product.id); load(); }
    catch { setError('Could not delete the product.'); }
  };
  const toggleActive = async (product: Product) => {
    try { await adminSetProductActive(adminCode, product.id, !product.active); load(); }
    catch { setError('Could not update the product.'); }
  };
  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const fields = [
    { label: 'Name *', value: editing?.name ?? '', change: (value: string) => { if (!editing) return; const slug = editing.id ? editing.slug : value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); setEditing({ ...editing, name: value, slug }); } },
    { label: 'URL slug *', value: editing?.slug ?? '', change: (value: string) => update('slug', value.toLowerCase().replace(/[^a-z0-9-]/g, '')) },
    { label: 'Sizes (comma separated)', value: editing?.sizes.join(', ') ?? '', change: (value: string) => update('sizes', value.split(',').map((item) => item.trim()).filter(Boolean)) },
    { label: 'Colors (comma separated)', value: editing?.colors.join(', ') ?? '', change: (value: string) => update('colors', value.split(',').map((item) => item.trim()).filter(Boolean)) },
    { label: 'Image URL (optional)', value: editing?.image_url ?? '', change: (value: string) => update('image_url', value.trim() || null) },
  ];

  return <Stack spacing={3}>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">{products.length} products</Typography>
      <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setEditing({ ...EMPTY_DRAFT })}>New product</Button>
    </Stack>
    {error && <Alert severity="error">{error}</Alert>}
    {editing && <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>{products.some((p) => p.slug === editing.slug && editing.id) ? 'Edit product' : 'New product'}</Typography>
          <Button aria-label="Close" onClick={() => setEditing(null)} color="inherit" sx={{ minWidth: 40, px: 1 }}><X size={18} /></Button>
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(3, minmax(0,1fr))' }, gap: 2 }}>
          {fields.slice(0, 2).map((field) => <TextField key={field.label} label={field.label} value={field.value} onChange={(e) => field.change(e.target.value)} />)}
          <TextField select label="Category" value={editing.category} onChange={(e) => update('category', e.target.value)}>
            {['women', 'men', 'accessories', 'shoes'].map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
          </TextField>
          <TextField label="Price *" type="number" inputProps={{ min: 0, step: 0.01 }} value={editing.price || ''} onChange={(e) => update('price', Number(e.target.value))} />
          <TextField label="Sale price" type="number" inputProps={{ min: 0, step: 0.01 }} value={editing.sale_price ?? ''} onChange={(e) => update('sale_price', e.target.value === '' ? null : Number(e.target.value))} />
          <TextField label="Stock" type="number" inputProps={{ min: 0 }} value={editing.stock} onChange={(e) => update('stock', Math.max(0, Number(e.target.value)))} />
          {fields.slice(2).map((field) => <TextField key={field.label} label={field.label} value={field.value} onChange={(e) => field.change(e.target.value)} />)}
          <TextField label="Description" multiline minRows={3} value={editing.description} onChange={(e) => update('description', e.target.value)} sx={{ gridColumn: { sm: '1 / -1' } }} />
          <Stack direction="row" flexWrap="wrap" gap={2} sx={{ gridColumn: { sm: '1 / -1' } }}>
            <FormControlLabel control={<Checkbox checked={editing.featured} onChange={(e) => update('featured', e.target.checked)} />} label="Featured" />
            <FormControlLabel control={<Checkbox checked={editing.active} onChange={(e) => update('active', e.target.checked)} />} label="Visible in store" />
          </Stack>
        </Box>
        <Stack direction="row" justifyContent="flex-end" gap={1.5}>
          <Button variant="outlined" onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving || !editing.name || !editing.slug || editing.price <= 0} startIcon={saving ? <CircularProgress size={15} color="inherit" /> : <Check size={15} />}>Save product</Button>
        </Stack>
      </Stack>
    </Paper>}
    {loading ? <Stack spacing={1.5}>{Array.from({ length: 5 }).map((_, i) => <Paper key={i} variant="outlined" sx={{ height: 64, bgcolor: 'action.hover' }} />)}</Stack> :
      <TableContainer component={Paper} variant="outlined"><Table size="small">
        <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Category</TableCell><TableCell>Price</TableCell><TableCell>Stock</TableCell><TableCell>Status</TableCell><TableCell align="right" /></TableRow></TableHead>
        <TableBody>
          {products.map((p) => <TableRow key={p.id} hover>
            <TableCell><Stack><Stack direction="row" alignItems="center" gap={1}><Typography variant="body2" fontWeight={600}>{p.name}</Typography>{p.featured && <Star size={13} color="#f59e0b" fill="#f59e0b" />}</Stack><Typography variant="caption" color="text.secondary">{p.slug}</Typography></Stack></TableCell>
            <TableCell sx={{ textTransform: 'capitalize' }}>{p.category}</TableCell>
            <TableCell>{p.sale_price !== null && p.sale_price < p.price ? <Stack><Typography color="error.main">{formatPrice(p.sale_price)}</Typography><Typography variant="caption" sx={{ textDecoration: 'line-through' }}>{formatPrice(p.price)}</Typography></Stack> : formatPrice(p.price)}</TableCell>
            <TableCell><Typography color={p.stock <= 5 ? 'warning.dark' : 'text.primary'} fontWeight={p.stock <= 5 ? 700 : 400}>{p.stock}</Typography></TableCell>
            <TableCell><Button size="small" color={p.active ? 'success' : 'inherit'} variant="outlined" onClick={() => toggleActive(p)}>{p.active ? 'Active' : 'Hidden'}</Button></TableCell>
            <TableCell><Stack direction="row" justifyContent="flex-end" gap={0.5}><Button size="small" onClick={() => setEditing({ id: p.id, name: p.name, slug: p.slug, description: p.description, price: p.price, sale_price: p.sale_price, category: p.category, colors: p.colors, sizes: p.sizes, stock: p.stock, image_url: p.image_url, featured: p.featured, active: p.active })}>Edit</Button><Button size="small" color="error" aria-label={`Delete ${p.name}`} onClick={() => remove(p)}><Trash2 size={15} /></Button></Stack></TableCell>
          </TableRow>)}
          {products.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>No products yet. Create your first product above.</TableCell></TableRow>}
        </TableBody>
      </Table></TableContainer>}
  </Stack>;
}
