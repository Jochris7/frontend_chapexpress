import type { Category } from '@/types';
import { apiClient } from './client';

export function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>('/categories');
}

export function createCategory(name: string): Promise<Category> {
  return apiClient<Category>('/categories', {
    method: 'POST',
    body: { name },
  });
}

export function deleteCategory(id: string): Promise<void> {
  return apiClient<void>(`/categories/${id}`, {
    method: 'DELETE',
  });
}
