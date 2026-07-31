'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-8">
        <p className="mb-1 text-sm font-medium text-accent">Bon retour</p>
        <h1 className="mb-6 text-2xl font-bold text-foreground">Connexion admin</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@chapexpress.com"
              className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-zinc-500 focus:border-accent focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Mot de passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-zinc-500 focus:border-accent focus:outline-none"
            />
          </label>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Connexion...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Démo : n&apos;importe quel email / mot de passe fonctionne.
        </p>
      </div>
    </div>
  );
}
