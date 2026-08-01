import type { Category, Product } from '@/types';
import { ApiError, API_BASE_URL, apiFetch } from './client';

export interface BackendProduct {
  id: string;
  title: string;
  description: string | null;
  categoryId: string;
  category: Category;
  price: number;
  quantity: number;
  size: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export function mapProduct(product: BackendProduct): Product {
  return {
    id: product.id,
    title: product.title,
    description: product.description ?? undefined,
    categoryId: product.categoryId,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
    size: product.size ?? undefined,
    imageUrl: product.imageUrl.startsWith('http')
      ? product.imageUrl
      : `${API_BASE_URL}${product.imageUrl}`,
    isAvailable: product.quantity > 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function getProducts(filters?: {
  categoryId?: string;
  search?: string;
  includeOutOfStock?: boolean;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.includeOutOfStock) params.set('includeOutOfStock', 'true');

  const query = params.toString();
  const products = await apiFetch<BackendProduct[]>(
    `/products${query ? `?${query}` : ''}`,
  );

  return products.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await apiFetch<BackendProduct>(`/products/${id}`);
    return mapProduct(product);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createProduct(data: FormData): Promise<Product> {
  const product = await apiFetch<BackendProduct>('/products', {
    method: 'POST',
    body: data,
    auth: true,
  });
  return mapProduct(product);
}

export async function updateProduct(id: string, data: FormData): Promise<Product> {
  const product = await apiFetch<BackendProduct>(`/products/${id}`, {
    method: 'PATCH',
    body: data,
    auth: true,
  });
  return mapProduct(product);
}

export function deleteProduct(id: string): Promise<void> {
  return apiFetch<void>(`/products/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
