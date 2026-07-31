'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setStatus(isValid ? 'success' : 'error');
  };

  return (
    <section className="mt-16 rounded-3xl bg-chrome px-6 py-16 text-center sm:px-12">
      <h2 className="text-3xl font-bold text-chrome-foreground sm:text-4xl">
        Rejoignez le club ChapExpress
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm text-chrome-foreground/70">
        Inscrivez-vous pour recevoir des offres exclusives et être informé de nos prochains
        lancements en avant-première.
      </p>

      {status === 'success' ? (
        <p className="mt-8 text-sm font-medium text-accent">Merci ! Vous êtes bien inscrit(e).</p>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus('idle');
            }}
            placeholder="votre@email.com"
            className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-chrome-foreground placeholder:text-chrome-foreground/50 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
          >
            S&apos;abonner
          </button>
        </form>
      )}
      {status === 'error' && <p className="mt-3 text-xs text-red-400">Merci de saisir un email valide.</p>}
    </section>
  );
}
