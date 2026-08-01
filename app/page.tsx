'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Category, Product } from '@/types';
import { getCategories } from '@/lib/api/categories';
import { getProducts } from '@/lib/api/products';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';
import { NewsletterSection } from '@/components/NewsletterSection';

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageFallback() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <ProductGridSkeleton />
    </main>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    // Resets the skeleton whenever the category or the ?q= search term
    // changes, since both can be triggered from outside this effect (a pill
    // click, or a search submitted from the navbar on another page).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    getProducts({
      categoryId: activeCategoryId ?? undefined,
      search: searchQuery || undefined,
    }).then((data) => {
      if (isCancelled) return;
      setProducts(data);
      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [activeCategoryId, searchQuery]);

  const newestProductIds = new Set(
    [...products]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 2)
      .map((product) => product.id),
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      {searchQuery && (
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Résultats pour « {searchQuery} » ·{' '}
          <Link href="/" className="font-medium text-accent hover:underline">
            Effacer
          </Link>
        </p>
      )}

      <div className="mb-6">
        <CategoryFilterBar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-zinc-500 dark:text-zinc-400">
          Aucun article ne correspond à cette recherche.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isNew={newestProductIds.has(product.id)}
            />
          ))}
        </div>
      )}

      <NewsletterSection />
    </main>
  );
}
