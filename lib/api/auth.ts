import { apiFetch, clearAuthToken, getAuthToken, setAuthToken } from './client';

export interface AdminUser {
  id: string;
  email: string;
}

interface LoginResponse {
  access_token: string;
}

function decodeToken(token: string): AdminUser {
  const payload = JSON.parse(atob(token.split('.')[1])) as {
    sub: string;
    email: string;
  };
  return { id: payload.sub, email: payload.email };
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const { access_token: accessToken } = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  setAuthToken(accessToken);
  return decodeToken(accessToken);
}

export function logout(): void {
  clearAuthToken();
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

export function getCurrentAdmin(): Promise<AdminUser> {
  return apiFetch<AdminUser>('/auth/me', { auth: true });
}
