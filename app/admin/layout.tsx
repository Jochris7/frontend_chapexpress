'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, logout } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const session = getSession();
    // Reading localStorage (an external system) to gate this route on mount;
    // same justified pattern as CartContext's hydration read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(Boolean(session));

    if (session && isLoginPage) {
      router.replace('/admin');
    } else if (!session && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isLoginPage, router]);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
