'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Order, OrderStatus } from '@/types';
import { getOrders, updateOrderStatus } from '@/lib/api/orders';
import { formatPrice } from '@/lib/format';
import { PAYMENT_LABELS, PAYMENT_STYLES, STATUS_LABELS, STATUS_STYLES } from '@/components/admin/orderStatus';
import { OrderDetailPanel } from '@/components/admin/OrderDetailPanel';

const STATUS_FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payé' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
];

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (statusFilter === 'all') return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const selectedOrder = orders?.find((order) => order.id === selectedOrderId) ?? null;

  const handleChangeStatus = async (status: OrderStatus) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    const updated = await updateOrderStatus(selectedOrder.id, status);
    setOrders((prev) => prev?.map((order) => (order.id === updated.id ? updated : order)) ?? prev);
    setIsUpdatingStatus(false);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Commandes</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? 'bg-accent text-black'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {orders === null ? (
        <TableSkeleton />
      ) : filteredOrders.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Aucune commande pour ce statut.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-white/10">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-surface text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Articles</th>
                <th className="px-4 py-3 font-medium">Montant total</th>
                <th className="px-4 py-3 font-medium">Paiement</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const preview = order.items.map((item) => item.product.title).join(', ');
                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="cursor-pointer border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{order.customerName}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{order.phone1}</td>
                    <td className="px-4 py-3">
                      <p className="text-foreground">
                        {itemCount} article{itemCount > 1 ? 's' : ''}
                      </p>
                      <p className="line-clamp-1 max-w-[220px] text-xs text-zinc-500 dark:text-zinc-400">
                        {preview}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${PAYMENT_STYLES[order.paymentMethod]}`}
                      >
                        {PAYMENT_LABELS[order.paymentMethod]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {dateFormatter.format(new Date(order.createdAt))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          isUpdating={isUpdatingStatus}
          onClose={() => setSelectedOrderId(null)}
          onChangeStatus={handleChangeStatus}
        />
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-zinc-100 p-4 last:border-0 dark:border-white/5"
        >
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
