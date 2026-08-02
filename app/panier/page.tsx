'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CartItem } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { getProducts } from '@/lib/api/products';
import { OrderForm } from '@/components/product/OrderForm';
import { CartIcon } from '@/components/CartIcon';
import { TrashIcon } from '@/components/TrashIcon';
import type { OrderItem } from '@/types';

function buildRevalidationMessage(removed: string[], adjusted: string[]): string {
  const parts: string[] = [];

  if (removed.length > 0) {
    parts.push(
      `${removed.join(', ')} ${removed.length > 1 ? 'ont été retirés' : 'a été retiré'} du panier (indisponible${removed.length > 1 ? 's' : ''})`,
    );
  }

  if (adjusted.length > 0) {
    parts.push(`Quantité réduite pour ${adjusted.join(', ')} (stock limité)`);
  }

  return parts.join(' · ');
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, replaceItems } = useCart();
  const [hasRevalidated, setHasRevalidated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [revalidationError, setRevalidationError] = useState<string | null>(null);

  useEffect(() => {
    if (hasRevalidated || items.length === 0) return;
    // Marks the async revalidation as started immediately so a re-render
    // triggered by replaceItems() below can't re-enter this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasRevalidated(true);

    getProducts({ includeOutOfStock: true })
      .then((allProducts) => {
        const productById = new Map(allProducts.map((product) => [product.id, product]));
        const removedTitles: string[] = [];
        const adjustedTitles: string[] = [];
        const validItems: CartItem[] = [];

        for (const item of items) {
          const fresh = productById.get(item.product.id);

          if (!fresh || !fresh.isAvailable) {
            removedTitles.push(item.product.title);
            continue;
          }

          const clampedQuantity = Math.min(item.quantity, fresh.quantity);
          if (clampedQuantity !== item.quantity) {
            adjustedTitles.push(fresh.title);
          }

          validItems.push({ product: fresh, quantity: clampedQuantity, size: item.size });
        }

        if (removedTitles.length > 0 || adjustedTitles.length > 0) {
          replaceItems(validItems);
          setNotice(buildRevalidationMessage(removedTitles, adjustedTitles));
        }
      })
      .catch(() => {
        setRevalidationError(
          'Impossible de vérifier la disponibilité de votre panier pour le moment.',
        );
      });
  }, [items, hasRevalidated, replaceItems]);

  const banner = notice || revalidationError;

  const bannerElement = banner && (
    <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-400">
      <p>{banner}</p>
      <button
        type="button"
        onClick={() => {
          setNotice(null);
          setRevalidationError(null);
        }}
        aria-label="Fermer"
        className="shrink-0 text-yellow-700/70 hover:text-yellow-700 dark:text-yellow-400/70 dark:hover:text-yellow-400"
      >
        ×
      </button>
    </div>
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        {bannerElement}
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

      {bannerElement}

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
