'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated as checkIsAuthenticated, logout } from '@/lib/api/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authenticated = checkIsAuthenticated();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(authenticated);

    if (authenticated && isLoginPage) {
      router.replace('/admin');
    } else if (!authenticated && !isLoginPage) {
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
