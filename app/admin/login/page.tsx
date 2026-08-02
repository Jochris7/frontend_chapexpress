'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login, saveToken } from '@/lib/api/auth';

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
      const { access_token: accessToken } = await login(email, password);
      saveToken(accessToken);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-zinc-200 bg-surface shadow-xl md:grid-cols-2 dark:border-white/10">
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
          <p className="mb-1 text-sm font-medium text-accent">Bon retour</p>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Connexion admin</h1>
          <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
            Gérez vos articles, vos commandes et vos catégories depuis un seul endroit.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@chapexpress.com"
                className="w-full rounded-full border border-zinc-300 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 focus:border-accent focus:outline-none dark:border-white/10 dark:placeholder:text-zinc-500"
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
                className="w-full rounded-full border border-zinc-300 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 focus:border-accent focus:outline-none dark:border-white/10 dark:placeholder:text-zinc-500"
              />
            </label>

            {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Connexion...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="hidden flex-col items-center justify-center gap-6 bg-accent/10 px-10 py-12 text-center md:flex">
          <div className="relative h-64 w-64">
            <Image
              src="/images/image_login1.svg"
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-lg font-bold text-foreground">
            Gérez votre boutique simplement avec <span className="text-accent">ChapExpress</span>
          </p>
        </div>
      </div>
    </div>
  );
}
