'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Category } from '@/types';
import { createCategory, deleteCategory, getCategories } from '@/lib/api/categories';
import { TrashIcon } from '@/components/TrashIcon';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Toast } from '@/components/Toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Impossible de charger les catégories.');
      });
  }, []);

  useEffect(() => {
    if (!isToastVisible) return;
    const timer = setTimeout(() => setIsToastVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [isToastVisible]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const category = await createCategory(name.trim());
      setCategories((prev) => (prev ? [...prev, category] : [category]));
      setName('');
      setToastMessage('Catégorie créée');
      setIsToastVisible(true);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev?.filter((category) => category.id !== deleteTarget.id) ?? prev);
      setDeleteTarget(null);
      setToastMessage('Catégorie supprimée');
      setIsToastVisible(true);
    } catch (err) {
      setDeleteTarget(null);
      setError(
        err instanceof Error ? err.message : 'Impossible de supprimer cette catégorie.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Catégories</h1>

      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nom de la nouvelle catégorie"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:border-accent focus:outline-none dark:border-white/10 dark:placeholder:text-zinc-500"
          />
          {createError && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{createError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isCreating || !name.trim()}
          className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isCreating ? 'Création...' : '+ Ajouter'}
        </button>
      </form>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      ) : categories === null ? (
        <ListSkeleton />
      ) : categories.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Aucune catégorie pour l&apos;instant.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-4 border-b border-zinc-100 bg-surface px-4 py-3 last:border-0 dark:border-white/5"
            >
              <div>
                <p className="font-medium text-foreground">{category.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">/{category.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(category)}
                aria-label="Supprimer"
                className="flex items-center justify-center rounded-lg border border-zinc-300 px-3 py-2 text-red-500 hover:bg-red-50 dark:border-white/10 dark:hover:bg-red-950/30"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Supprimer cette catégorie ?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" sera définitivement supprimée. Impossible si des produits l'utilisent encore.`
            : ''
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

function ListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="border-b border-zinc-100 p-4 last:border-0 dark:border-white/5">
          <div className="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
