import type { Category } from '@/types';
import { apiFetch } from './client';

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories');
}

export function createCategory(name: string): Promise<Category> {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: { name },
    auth: true,
  });
}

export function deleteCategory(id: string): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
