const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | Record<string, unknown>;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  const token =
    typeof window !== 'undefined' ? window.localStorage.getItem('admin_token') : null;

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body as BodyInit | undefined;

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = Array.isArray(errorBody?.message)
      ? errorBody.message.join(', ')
      : (errorBody?.message ?? `Erreur ${response.status}`);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
