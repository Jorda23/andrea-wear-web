import type { Product, Order, OrderItem, OrderStatus, CustomerDraft, OrderWithItems } from './types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

type JsonRecord = Record<string, unknown>;

class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function field<T>(row: JsonRecord, camel: string, snake: string): T {
  return (row[camel] ?? row[snake]) as T;
}

function mapProduct(value: unknown): Product {
  const row = value as JsonRecord;
  return {
    id: field(row, 'id', 'id'),
    name: field(row, 'name', 'name'),
    slug: field(row, 'slug', 'slug'),
    description: field(row, 'description', 'description') ?? '',
    price: Number(field(row, 'price', 'price')),
    sale_price: field(row, 'salePrice', 'sale_price') ?? null,
    category: field(row, 'category', 'category'),
    colors: field(row, 'colors', 'colors') ?? [],
    sizes: field(row, 'sizes', 'sizes') ?? [],
    stock: Number(field(row, 'stock', 'stock') ?? 0),
    image_url: field(row, 'imageUrl', 'image_url') ?? null,
    featured: Boolean(field(row, 'featured', 'featured')),
    active: field(row, 'active', 'active') !== false,
    created_at: field(row, 'createdAt', 'created_at'),
  };
}

function mapOrderItem(value: unknown): OrderItem {
  const row = value as JsonRecord;
  return {
    id: field(row, 'id', 'id'),
    order_id: field(row, 'orderId', 'order_id'),
    product_id: field(row, 'productId', 'product_id') ?? null,
    product_name: field(row, 'productName', 'product_name'),
    size: field(row, 'size', 'size') ?? null,
    color: field(row, 'color', 'color') ?? null,
    unit_price: Number(field(row, 'unitPrice', 'unit_price')),
    quantity: Number(field(row, 'quantity', 'quantity')),
  };
}

function mapOrder(value: unknown): Order {
  const row = value as JsonRecord;
  return {
    id: field(row, 'id', 'id'),
    order_number: field(row, 'orderNumber', 'order_number'),
    customer_id: field(row, 'customerId', 'customer_id') ?? null,
    shipping_name: field(row, 'shippingName', 'shipping_name'),
    shipping_email: field(row, 'shippingEmail', 'shipping_email'),
    shipping_phone: field(row, 'shippingPhone', 'shipping_phone') ?? null,
    shipping_address: field(row, 'shippingAddress', 'shipping_address'),
    shipping_city: field(row, 'shippingCity', 'shipping_city'),
    shipping_postal_code: field(row, 'shippingPostalCode', 'shipping_postal_code'),
    shipping_country: field(row, 'shippingCountry', 'shipping_country'),
    subtotal: Number(field(row, 'subtotal', 'subtotal')),
    shipping_cost: Number(field(row, 'shippingCost', 'shipping_cost')),
    total: Number(field(row, 'total', 'total')),
    status: field(row, 'status', 'status') as OrderStatus,
    created_at: field(row, 'createdAt', 'created_at'),
  };
}

function mapOrderWithItems(value: unknown): OrderWithItems {
  const row = value as JsonRecord;
  const items = (row.items ?? row.orderItems ?? row.order_items ?? []) as unknown[];
  return { ...mapOrder(value), items: items.map(mapOrderItem) };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    let message = `API request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message ?? body.title ?? body.error ?? message;
    } catch {
      // Keep the HTTP status message when the API has no JSON error body.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function unwrapList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const row = value as JsonRecord;
  return (row.items ?? row.data ?? row.results ?? []) as unknown[];
}

export async function fetchProducts(options?: { includeInactive?: boolean }): Promise<Product[]> {
  const query = new URLSearchParams({ page: '1', pageSize: '100' });
  const endpoint = options?.includeInactive ? '/api/admin/products' : '/api/products';
  const data = await request<unknown>(`${endpoint}?${query}`);
  return unwrapList(data).map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    return mapProduct(await request<unknown>(`/api/products/${encodeURIComponent(slug)}`));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export interface ProductDraft {
  id?: string;
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
}

function toProductRequest(product: ProductDraft) {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    salePrice: product.sale_price,
    category: product.category,
    colors: product.colors,
    sizes: product.sizes,
    stock: product.stock,
    imageUrl: product.image_url,
    featured: product.featured,
    active: product.active,
  };
}

export async function adminUpsertProduct(_adminCode: string, product: ProductDraft): Promise<Product> {
  const data = product.id
    ? await request<unknown>(`/api/admin/products/${encodeURIComponent(product.id)}`, {
        method: 'PUT', body: JSON.stringify(toProductRequest(product)),
      })
    : await request<unknown>('/api/admin/products', {
        method: 'POST', body: JSON.stringify(toProductRequest(product)),
      });
  return mapProduct(data);
}

export async function adminDeleteProduct(_adminCode: string, id: string): Promise<void> {
  await request(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function adminSetProductActive(_adminCode: string, id: string, active: boolean): Promise<void> {
  await request(`/api/admin/products/${encodeURIComponent(id)}/active`, {
    method: 'PATCH', body: JSON.stringify({ active }),
  });
}

export interface PlaceOrderInput {
  customer: CustomerDraft;
  items: { productId: string; name: string; price: number; size: string | null; color: string | null; quantity: number }[];
  subtotal: number;
  shippingCost: number;
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const order = await request<unknown>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        phone: input.customer.phone,
        addressLine1: input.customer.address_line1,
        city: input.customer.city,
        postalCode: input.customer.postal_code,
        country: input.customer.country,
      },
      items: input.items.map(({ productId, size, color, quantity }) => ({ productId, size, color, quantity })),
    }),
  });
  return mapOrder(order);
}

export async function fetchOrderByNumber(orderNumber: string, email?: string): Promise<OrderWithItems | null> {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  try {
    return mapOrderWithItems(await request<unknown>(
      `/api/orders/track/${encodeURIComponent(orderNumber.trim().toUpperCase())}${query}`,
    ));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function fetchOrdersAdmin(_adminCode: string): Promise<OrderWithItems[]> {
  const data = await request<unknown>('/api/admin/orders?page=1&pageSize=100');
  return unwrapList(data).map(mapOrderWithItems);
}

export async function fetchCustomersAdmin(_adminCode: string) {
  const data = await request<unknown>('/api/admin/customers?page=1&pageSize=100');
  return unwrapList(data).map((value): {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address_line1: string;
    city: string;
    postal_code: string;
    country: string;
    created_at: string;
  } => {
    const row = value as JsonRecord;
    return {
      id: field(row, 'id', 'id'),
      name: field(row, 'name', 'name'),
      email: field(row, 'email', 'email'),
      phone: field(row, 'phone', 'phone') ?? null,
      address_line1: field(row, 'addressLine1', 'address_line1') ?? '',
      city: field(row, 'city', 'city') ?? '',
      postal_code: field(row, 'postalCode', 'postal_code') ?? '',
      country: field(row, 'country', 'country') ?? '',
      created_at: field(row, 'createdAt', 'created_at'),
    };
  });
}

export async function updateOrderStatus(_adminCode: string, orderId: string, status: OrderStatus): Promise<void> {
  await request(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH', body: JSON.stringify({ status }),
  });
}

export async function fetchWishlistProductIds(): Promise<string[]> {
  const data = await request<unknown>('/api/wishlist');
  if (Array.isArray(data)) return data.map((item) => typeof item === 'string' ? item : String((item as JsonRecord).productId ?? (item as JsonRecord).product_id));
  const row = data as JsonRecord;
  return (row.productIds ?? row.product_ids ?? row.items ?? []) as string[];
}

export async function addToWishlist(productId: string): Promise<void> {
  await request('/api/wishlist/items', { method: 'POST', body: JSON.stringify({ productId }) });
}

export async function removeFromWishlist(productId: string): Promise<void> {
  await request(`/api/wishlist/items/${encodeURIComponent(productId)}`, { method: 'DELETE' });
}
