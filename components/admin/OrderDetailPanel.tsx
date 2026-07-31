import Image from 'next/image';
import type { ReactNode } from 'react';
import type { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/format';
import { PAYMENT_LABELS, STATUS_STYLES } from '@/components/admin/orderStatus';

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payé' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
];

export function OrderDetailPanel({
  order,
  isUpdating,
  onClose,
  onChangeStatus,
}: {
  order: Order;
  isUpdating: boolean;
  onClose: () => void;
  onChangeStatus: (status: OrderStatus) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/50">
      <div className="flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-zinc-200 bg-background p-6 dark:border-white/10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Commande
            </p>
            <p className="text-lg font-bold text-foreground">#{order.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <Section title="Statut">
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isUpdating}
                onClick={() => onChangeStatus(option.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  order.status === option.value
                    ? STATUS_STYLES[option.value]
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Client">
          <InfoRow label="Nom" value={order.customerName} />
          <InfoRow label="Téléphone 1" value={order.phone1} />
          {order.phone2 && <InfoRow label="Téléphone 2" value={order.phone2} />}
          <InfoRow label="Ville" value={order.city} />
          <InfoRow
            label="Zone de livraison"
            value={`${order.deliveryZone.name} (${formatPrice(order.deliveryZone.fee)})`}
          />
          {order.district && <InfoRow label="Quartier / Gare" value={order.district} />}
          {order.promoCode && <InfoRow label="Code promo" value={order.promoCode} />}
        </Section>

        <Section title="Articles">
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.size ?? ''}`} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-0.5">
                  <p className="line-clamp-1 text-sm font-medium text-foreground">
                    {item.product.title}
                  </p>
                  {item.size && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Taille : {item.size}
                    </p>
                  )}
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Qté : {item.quantity}</p>
                </div>
                <p className="shrink-0 self-center text-sm font-semibold text-foreground">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Paiement">
          <InfoRow label="Mode" value={PAYMENT_LABELS[order.paymentMethod]} />
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Montant articles</span>
            <span className="text-foreground">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Frais de livraison</span>
            <span className="text-foreground">{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-zinc-200 pt-2 text-sm font-semibold dark:border-white/10">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{formatPrice(order.total)}</span>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6 border-t border-zinc-200 pt-6 first:border-0 first:pt-0 dark:border-white/10">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
