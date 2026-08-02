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

export function getImageUrl(path: string): string {
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
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
    imageUrl: getImageUrl(product.imageUrl),
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

interface ProductFormFields {
  title: string;
  description?: string;
  categoryId: string;
  price: number;
  quantity: number;
  size?: string;
  image: File;
}

export async function createProduct(data: ProductFormFields): Promise<Product> {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  formData.append('categoryId', data.categoryId);
  formData.append('price', String(data.price));
  formData.append('quantity', String(data.quantity));
  if (data.size) formData.append('size', data.size);
  formData.append('image', data.image);

  const product = await apiClient<BackendProduct>('/products', {
    method: 'POST',
    body: formData,
  });

  return mapProduct(product);
}

export async function updateProduct(
  id: string,
  data: Partial<ProductFormFields>,
): Promise<Product> {
  const formData = new FormData();
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.categoryId !== undefined) formData.append('categoryId', data.categoryId);
  if (data.price !== undefined) formData.append('price', String(data.price));
  if (data.quantity !== undefined) formData.append('quantity', String(data.quantity));
  if (data.size !== undefined) formData.append('size', data.size);
  if (data.image !== undefined) formData.append('image', data.image);

  const product = await apiClient<BackendProduct>(`/products/${id}`, {
    method: 'PATCH',
    body: formData,
  });

  return mapProduct(product);
}

export function deleteProduct(id: string): Promise<void> {
  return apiClient<void>(`/products/${id}`, {
    method: 'DELETE',
  });
}
