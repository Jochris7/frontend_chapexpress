'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { CartIcon } from '@/components/CartIcon';
import { SearchIcon } from '@/components/SearchIcon';
import { SunIcon, MoonIcon } from '@/components/ThemeIcons';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/nouveautes', label: 'Nouveautés' },
];

export function Navbar() {
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    setIsMenuOpen(false);
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-chrome">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
        <Link href="/" className="text-lg font-bold text-chrome-foreground">
          ChapExpress
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 pb-0.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-accent text-accent'
                    : 'border-transparent text-chrome-foreground/80 hover:text-chrome-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chrome-foreground/50" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Rechercher..."
              className="w-36 rounded-full border border-white/15 bg-white/5 py-1.5 pl-9 pr-3 text-sm text-chrome-foreground placeholder:text-chrome-foreground/50 transition-[width] focus:w-52 focus:border-accent focus:outline-none"
            />
          </form>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
            className="text-chrome-foreground"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          <Link href="/panier" aria-label="Panier" className="relative text-chrome-foreground">
            <CartIcon className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-black">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="text-chrome-foreground sm:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 px-4 py-3 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chrome-foreground/50" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-full border border-white/15 bg-white/5 py-1.5 pl-9 pr-3 text-sm text-chrome-foreground placeholder:text-chrome-foreground/50 focus:border-accent focus:outline-none"
            />
          </form>
          <ul className="mx-auto flex max-w-6xl flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-chrome-foreground/90 hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
