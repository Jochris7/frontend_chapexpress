'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Category, Product } from '@/types';
import { getCategories } from '@/lib/api/categories';
import { deleteProduct, getProducts } from '@/lib/api/products';
import { formatPrice } from '@/lib/format';
import { consumeFlashMessage } from '@/lib/flash';
import { CategoryTag } from '@/components/CategoryTag';
import { Toast } from '@/components/Toast';
import { TrashIcon } from '@/components/TrashIcon';
import { SearchIcon } from '@/components/SearchIcon';
import { PencilIcon } from '@/components/admin/icons';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

const LOW_STOCK_THRESHOLD = 5;

export default function AdminArticlesPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    getProducts({ includeOutOfStock: true }).then(setProducts);
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const message = consumeFlashMessage();
    if (message) {
      // Reads the one-off flash message left by the create/edit pages after
      // their redirect; same justified external-read pattern as
      // CartContext's localStorage hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToastMessage(message);
      setIsToastVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isToastVisible) return;
    const timer = setTimeout(() => setIsToastVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [isToastVisible]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !query || product.title.toLowerCase().includes(query);
      const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteProduct(deleteTarget.id);
    setProducts((prev) => prev?.filter((product) => product.id !== deleteTarget.id) ?? prev);
    setIsDeleting(false);
    setDeleteTarget(null);
    setToastMessage('Article supprimé');
    setIsToastVisible(true);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Articles</h1>
        <Link
          href="/admin/articles/nouveau"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          + Ajouter un article
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un article..."
            className="w-full rounded-lg border border-zinc-300 bg-transparent py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-zinc-400 focus:border-accent focus:outline-none dark:border-white/10 dark:placeholder:text-zinc-500"
          />
        </div>

        <select
          value={categoryFilter ?? ''}
          onChange={(event) => setCategoryFilter(event.target.value || null)}
          className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none dark:border-white/10"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {products === null ? (
        <ArticlesGridSkeleton />
      ) : filteredProducts.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Aucun article ne correspond à cette recherche.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ArticleCard key={product.id} product={product} onDelete={() => setDeleteTarget(product)} />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Supprimer cet article ?"
        message={
          deleteTarget ? `"${deleteTarget.title}" sera définitivement supprimé du catalogue.` : ''
        }
        confirmLabel="Supprimer"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={toastMessage} isVisible={isToastVisible} />
    </div>
  );
}

function ArticleCard({ product, onDelete }: { product: Product; onDelete: () => void }) {
  const isLowStock = product.quantity < LOW_STOCK_THRESHOLD;

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-surface dark:border-white/10">
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
        <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
      </div>
      <div className="space-y-2 p-4">
        <CategoryTag name={product.category.name} />
        <h3 className="line-clamp-1 font-semibold text-foreground">{product.title}</h3>
        <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
        <p>
          <span
            className={
              isLowStock
                ? 'rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-950 dark:text-red-400'
                : 'text-sm text-zinc-500 dark:text-zinc-400'
            }
          >
            Stock : {product.quantity}
          </span>
        </p>
        <div className="flex gap-2 pt-2">
          <Link
            href={`/admin/articles/${product.id}/edit`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-300 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
          >
            <PencilIcon className="h-4 w-4" />
            Éditer
          </Link>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Supprimer"
            className="flex items-center justify-center rounded-lg border border-zinc-300 px-3 text-red-500 hover:bg-red-50 dark:border-white/10 dark:hover:bg-red-950/30"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ArticlesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10"
        >
          <div className="aspect-square animate-pulse bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
