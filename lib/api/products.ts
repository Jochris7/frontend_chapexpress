import type { Category, Product } from '@/types';
import { apiClient } from './client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

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
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);
  if (filters?.search) params.set('search', filters.search);

  const query = params.toString();
  const products = await apiClient<BackendProduct[]>(
    `/products${query ? `?${query}` : ''}`,
  );

  return products.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await apiClient<BackendProduct>(`/products/${id}`);
    return mapProduct(product);
  } catch {
    return null;
  }
}
