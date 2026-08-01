'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { getProductById } from '@/lib/api/products';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { CategoryTag } from '@/components/CategoryTag';
import { Toast } from '@/components/Toast';
import { OrderForm } from '@/components/product/OrderForm';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [isBuying, setIsBuying] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    getProductById(id).then((data) => {
      if (isCancelled) return;
      setProduct(data);
    });
    return () => {
      isCancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!isToastVisible) return;
    const timer = setTimeout(() => setIsToastVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [isToastVisible]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, 1, product.size);
    setIsToastVisible(true);
  };

  if (product === undefined) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <ProductDetailSkeleton />
      </main>
    );
  }

  if (product === null) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <p className="text-lg font-semibold text-foreground">Produit introuvable.</p>
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          ← Retourner à l&apos;accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <CategoryTag name={product.category.name} />
          <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
          {product.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{product.description}</p>
          )}

          {product.size && (
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Taille</p>
              <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border-2 border-accent px-3 text-sm font-semibold text-foreground">
                {product.size}
              </span>
            </div>
          )}

          <p className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>

          {!product.isAvailable && (
            <span className="inline-block w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950 dark:text-red-400">
              Rupture de stock
            </span>
          )}

          <div className="mt-2 flex flex-col gap-3">
            {product.isAvailable ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsBuying(true)}
                  className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01]"
                >
                  Acheter
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full rounded-full border-2 border-foreground px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Ajouter au panier
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-full bg-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              >
                Indisponible
              </button>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-foreground dark:text-zinc-400"
            >
              <span aria-hidden="true">←</span> Retourner à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isBuying ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {isBuying && (
            <div className="mt-10 border-t border-zinc-200 pt-10 dark:border-zinc-800">
              <OrderForm
                items={[
                  {
                    productId: product.id,
                    product,
                    quantity: 1,
                    unitPrice: product.price,
                    size: product.size,
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>

      <Toast message="Article ajouté au panier" isVisible={isToastVisible} />
    </main>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
      <div className="aspect-square w-full animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-4">
        <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 flex flex-col gap-3">
          <div className="h-12 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-12 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
