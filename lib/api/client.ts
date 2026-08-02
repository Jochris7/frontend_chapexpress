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

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorData = data as { message?: string | string[] } | null;
    const message = Array.isArray(errorData?.message)
      ? errorData.message.join(', ')
      : (errorData?.message ?? `Erreur ${response.status}`);
    throw new Error(message);
  }

  return data as T;
}
