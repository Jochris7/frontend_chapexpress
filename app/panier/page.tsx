'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { OrderForm } from '@/components/product/OrderForm';
import { CartIcon } from '@/components/CartIcon';
import type { OrderItem } from '@/types';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <CartIcon className="h-16 w-16 text-zinc-300 dark:text-zinc-700" />
        <p className="text-lg font-semibold text-foreground">Votre panier est vide</p>
        <Link
          href="/"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01]"
        >
          Découvrir les articles
        </Link>
      </main>
    );
  }

  const orderItems: OrderItem[] = items.map((item) => ({
    productId: item.product.id,
    product: item.product,
    quantity: item.quantity,
    unitPrice: item.product.price,
    size: item.size,
  }));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Mon panier</h1>

      <div className="mb-10 flex flex-col rounded-2xl border border-zinc-200 px-4 dark:border-zinc-800">
        {items.map((item) => (
          <CartRow
            key={`${item.product.id}-${item.size ?? ''}`}
            item={item}
            onIncrease={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
            onDecrease={() => {
              if (item.quantity <= 1) {
                removeItem(item.product.id, item.size);
              } else {
                updateQuantity(item.product.id, item.quantity - 1, item.size);
              }
            }}
            onRemove={() => removeItem(item.product.id, item.size)}
          />
        ))}
      </div>

      <div className="border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <OrderForm items={orderItems} />
      </div>
    </main>
  );
}

function CartRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-zinc-200 py-4 last:border-0 dark:border-zinc-800">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
        <Image src={item.product.imageUrl} alt={item.product.title} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="font-semibold text-foreground">{item.product.title}</p>
        {item.size && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Taille : {item.size}</p>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {formatPrice(item.product.price)} / unité
        </p>
        <div className="mt-1">
          <QuantityStepper quantity={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <p className="font-semibold text-foreground">
          {formatPrice(item.product.price * item.quantity)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Supprimer l'article"
          className="text-zinc-400 transition-colors hover:text-red-500"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-zinc-300 px-2 py-1 dark:border-zinc-700">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Diminuer la quantité"
        className="flex h-6 w-6 items-center justify-center rounded-full text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        −
      </button>
      <span className="w-4 text-center text-sm font-medium text-foreground">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Augmenter la quantité"
        className="flex h-6 w-6 items-center justify-center rounded-full text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        +
      </button>
    </div>
  );
}

function TrashIcon({ className }: { className?: string }) {
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
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
    </svg>
  );
}
