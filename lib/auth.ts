export interface AdminSession {
  token: string;
  email: string;
  expiresAt: string;
}

const STORAGE_KEY = 'chapexpress-admin-session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8h, mirrors a typical JWT expiry

const wait = (ms = 500) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Mock admin auth: accepts any non-empty email/password and returns a fake
// session token. Swap this body for a real `POST /auth/login` call to NestJS
// (which will return an actual JWT) without changing the signature or the
// AdminSession shape consumers rely on.
export async function login(email: string, password: string): Promise<AdminSession> {
  await wait();
  if (!email.trim() || !password.trim()) {
    throw new Error('Email et mot de passe requis.');
  }

  const session: AdminSession = {
    token: `mock-jwt.${btoa(email.trim())}.${Date.now()}`,
    email: email.trim(),
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function logout(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getSession(): AdminSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AdminSession;
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
