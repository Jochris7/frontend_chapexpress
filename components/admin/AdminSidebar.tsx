'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CartIcon } from '@/components/CartIcon';
import { SunIcon, MoonIcon } from '@/components/ThemeIcons';
import { useTheme } from '@/context/ThemeContext';
import { ArticlesIcon, CategoriesIcon, DashboardIcon, LogoutIcon } from '@/components/admin/icons';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', Icon: DashboardIcon },
  { href: '/admin/articles', label: 'Articles', Icon: ArticlesIcon },
  { href: '/admin/commandes', label: 'Commandes', Icon: CartIcon },
  { href: '/admin/categories', label: 'Catégories', Icon: CategoriesIcon },
];

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-zinc-200 bg-surface p-6 dark:border-white/10">
      <div>
        <div className="mb-8">
          <p className="text-lg font-bold text-foreground">ChapExpress</p>
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Espace admin
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-black'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-foreground dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-foreground"
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          {theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-red-400"
        >
          <LogoutIcon className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
