import { apiClient } from './client';

const TOKEN_KEY = 'admin_token';

export function login(email: string, password: string): Promise<{ access_token: string }> {
  return apiClient<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function saveToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
