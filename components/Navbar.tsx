'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { CartIcon } from '@/components/CartIcon';
import { SunIcon, MoonIcon } from '@/components/ThemeIcons';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/nouveautes', label: 'Nouveautés' },
];

export function Navbar() {
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-chrome">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-chrome-foreground">
          ChapExpress
        </Link>

        <div className="flex items-center gap-4">
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
            className="text-chrome-foreground"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 px-4 py-3">
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

