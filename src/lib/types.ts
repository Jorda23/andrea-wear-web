export type Category = 'women' | 'men' | 'accessories' | 'shoes' | 'general';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  category: string;
  colors: string[];
  sizes: string[];
  stock: number;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  maxStock: number;
}

export interface WishlistEntry {
  id: string;
  product_id: string;
}

export interface CustomerDraft {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  size: string | null;
  color: string | null;
  unit_price: number;
  quantity: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export const CATEGORIES: { value: string; label: string }[] = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
];

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export function effectivePrice(p: Product): number {
  return p.sale_price !== null && p.sale_price < p.price ? p.sale_price : p.price;
}

export function isOnSale(p: Product): boolean {
  return p.sale_price !== null && p.sale_price < p.price;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
