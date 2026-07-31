import type { OrderStatus, PaymentMethod } from '@/types';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  paid: 'Payé',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

export const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400',
  paid: 'bg-lime-100 text-lime-800 dark:bg-lime-500/15 dark:text-lime-400',
  delivered: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  wave: 'Wave',
  cash_on_delivery: 'Livraison',
};

export const PAYMENT_STYLES: Record<PaymentMethod, string> = {
  wave: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  cash_on_delivery: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
};
