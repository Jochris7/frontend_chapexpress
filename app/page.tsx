'use client';

import { useEffect, useState } from 'react';
import type { Category, Product } from '@/types';
import { getCategories, getProducts } from '@/lib/api';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    getProducts(activeCategoryId ? { categoryId: activeCategoryId } : undefined).then((data) => {
      if (isCancelled) return;
      setProducts(data);
      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [activeCategoryId]);

  const handleSelectCategory = (categoryId: string | null) => {
    setIsLoading(true);
    setActiveCategoryId(categoryId);
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6">
        <CategoryFilterBar
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={handleSelectCategory}
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-zinc-500 dark:text-zinc-400">
          Aucun article disponible dans cette catégorie.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
