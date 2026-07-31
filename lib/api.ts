import type { Category, DeliveryZone, Order, OrderStatus, Product } from '@/types';
import {
  categories as seedCategories,
  deliveryZones as seedDeliveryZones,
  orders as seedOrders,
  products as seedProducts,
} from './mock-data';

// Mock API layer: same signatures the real client will use once each body
// below is swapped for a `fetch(`${NEXT_PUBLIC_API_URL}/...`)` call to NestJS.

const wait = (ms = 400) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const db = {
  categories: [...seedCategories],
  products: [...seedProducts],
  deliveryZones: [...seedDeliveryZones],
  orders: [...seedOrders],
};

export async function getProducts(filters?: {
  categoryId?: string;
  search?: string;
  includeOutOfStock?: boolean;
}): Promise<Product[]> {
  await wait();
  let result = db.products;
  if (!filters?.includeOutOfStock) {
    result = result.filter((p) => p.isAvailable);
  }
  if (filters?.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters?.search) {
    const query = filters.search.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(query));
  }
  return result;
}

export async function getProductById(id: string): Promise<Product | null> {
  await wait();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  await wait();
  return db.categories;
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  await wait();
  return db.deliveryZones;
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'createdAt' | 'status'>,
): Promise<Order> {
  await wait();
  const order: Order = {
    ...orderData,
    id: generateId('order'),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.orders = [...db.orders, order];
  return order;
}

export async function getOrders(): Promise<Order[]> {
  await wait();
  return db.orders;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  await wait();
  const existing = db.orders.find((o) => o.id === id);
  if (!existing) throw new Error(`Unknown order id: ${id}`);

  const updated: Order = { ...existing, status };
  db.orders = db.orders.map((o) => (o.id === id ? updated : o));
  return updated;
}

export async function createProduct(data: FormData): Promise<Product> {
  await wait();
  const categoryId = String(data.get('categoryId'));
  const category = db.categories.find((c) => c.id === categoryId);
  if (!category) throw new Error(`Unknown category id: ${categoryId}`);

  const imageFile = data.get('image');
  const imageUrl = imageFile instanceof File ? URL.createObjectURL(imageFile) : '';
  const quantity = Number(data.get('quantity'));
  const now = new Date().toISOString();

  const product: Product = {
    id: generateId('prod'),
    title: String(data.get('title')),
    description: data.get('description') ? String(data.get('description')) : undefined,
    categoryId,
    category,
    price: Number(data.get('price')),
    quantity,
    size: data.get('size') ? String(data.get('size')) : undefined,
    imageUrl,
    isAvailable: quantity > 0,
    createdAt: now,
    updatedAt: now,
  };

  db.products = [...db.products, product];
  return product;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  await wait();
  const existing = db.products.find((p) => p.id === id);
  if (!existing) throw new Error(`Unknown product id: ${id}`);

  const updated: Product = {
    ...existing,
    ...data,
    id: existing.id,
    isAvailable: (data.quantity ?? existing.quantity) > 0,
    updatedAt: new Date().toISOString(),
  };

  db.products = db.products.map((p) => (p.id === id ? updated : p));
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  await wait();
  db.products = db.products.filter((p) => p.id !== id);
}

export async function createCategory(name: string): Promise<Category> {
  await wait();
  const category: Category = {
    id: generateId('cat'),
    name,
    slug: slugify(name),
    createdAt: new Date().toISOString(),
  };
  db.categories = [...db.categories, category];
  return category;
}
