'use client';

import { useEffect, useState } from 'react';
import type { Order, Product } from '@/types';
import { getOrders, getProducts } from '@/lib/api';
import { formatPrice } from '@/lib/format';

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getProducts({ includeOutOfStock: true }).then(setProducts);
    getOrders().then(setOrders);
  }, []);

  const isLoading = products === null || orders === null;
  const now = new Date();

  const ordersToday =
    orders?.filter((order) => isSameDay(new Date(order.createdAt), now)).length ?? 0;

  const monthlyRevenue =
    orders
      ?.filter(
        (order) =>
          isSameMonth(new Date(order.createdAt), now) &&
          (order.status === 'paid' || order.status === 'delivered'),
      )
      .reduce((sum, order) => sum + order.total, 0) ?? 0;

  const outOfStockCount = products?.filter((product) => !product.isAvailable).length ?? 0;

  const stats: { label: string; value: string | number }[] = [
    { label: "Nombre d'articles", value: products?.length ?? 0 },
    { label: 'Commandes du jour', value: ordersToday },
    { label: "Chiffre d'affaires du mois", value: formatPrice(monthlyRevenue) },
    { label: 'Articles en rupture de stock', value: outOfStockCount },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string | number;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      {isLoading ? (
        <div className="mt-3 h-7 w-20 animate-pulse rounded bg-white/10" />
      ) : (
        <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      )}
    </div>
  );
}
