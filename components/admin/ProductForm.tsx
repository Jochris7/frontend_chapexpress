'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { DragEvent, FormEvent, ReactNode } from 'react';
import type { Category, Product } from '@/types';
import { createCategory, getCategories } from '@/lib/api/categories';
import { createProduct, updateProduct } from '@/lib/api/products';
import { formatPrice } from '@/lib/format';
import { CategoryTag } from '@/components/CategoryTag';

const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:border-accent focus:outline-none dark:border-white/10 dark:placeholder:text-zinc-500';

interface ProductFormProps {
  mode: 'create' | 'edit';
  product?: Product;
  onSuccess: (product: Product) => void;
}

export function ProductForm({ mode, product, onSuccess }: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(product?.imageUrl ?? null);
  const [isDragActive, setIsDragActive] = useState(false);

  const [title, setTitle] = useState(product?.title ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [quantity, setQuantity] = useState(product ? String(product.quantity) : '');
  const [size, setSize] = useState(product?.size ?? '');

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryInput, setCategoryInput] = useState(product?.category.name ?? '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    product?.categoryId ?? null,
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    return () => {
      if (imageFile && imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imageFile, imagePreviewUrl]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };

  const trimmedCategoryInput = categoryInput.trim();
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(trimmedCategoryInput.toLowerCase()),
  );
  const exactCategoryMatch = categories.find(
    (category) => category.name.toLowerCase() === trimmedCategoryInput.toLowerCase(),
  );
  const canCreateCategory = trimmedCategoryInput.length > 0 && !exactCategoryMatch;

  const handleCategoryInputChange = (value: string) => {
    setCategoryInput(value);
    setSelectedCategoryId(null);
    setIsCategoryDropdownOpen(true);
  };

  const handleSelectCategory = (category: Category) => {
    setCategoryInput(category.name);
    setSelectedCategoryId(category.id);
    setIsCategoryDropdownOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!canCreateCategory) return;
    setIsCreatingCategory(true);
    const category = await createCategory(trimmedCategoryInput);
    setCategories((prev) => [...prev, category]);
    setCategoryInput(category.name);
    setSelectedCategoryId(category.id);
    setIsCategoryDropdownOpen(false);
    setIsCreatingCategory(false);
  };

  const priceValue = Number(price);
  const quantityValue = Number(quantity);
  const canSubmit =
    title.trim().length > 0 &&
    selectedCategoryId !== null &&
    price.trim().length > 0 &&
    Number.isInteger(priceValue) &&
    priceValue > 0 &&
    quantity.trim().length > 0 &&
    Number.isInteger(quantityValue) &&
    quantityValue >= 0 &&
    (mode === 'edit' || imageFile !== null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !selectedCategoryId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'create') {
        if (!imageFile) return;
        const saved = await createProduct({
          title: title.trim(),
          categoryId: selectedCategoryId,
          price: priceValue,
          quantity: quantityValue,
          size: size.trim() || undefined,
          image: imageFile,
        });
        onSuccess(saved);
      } else if (product) {
        const saved = await updateProduct(product.id, {
          title: title.trim(),
          categoryId: selectedCategoryId,
          price: priceValue,
          quantity: quantityValue,
          size: size.trim() || undefined,
          image: imageFile ?? undefined,
        });
        onSuccess(saved);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_220px]">
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          className={`relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragActive
              ? 'border-accent bg-accent/5'
              : 'border-zinc-300 hover:border-zinc-400 dark:border-white/10 dark:hover:border-white/20'
          }`}
        >
          {imagePreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- local file/blob preview, not a production asset served through next/image
            <img
              src={imagePreviewUrl}
              alt="Aperçu de l'article"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <UploadIcon className="h-8 w-8 text-zinc-400" />
              <p className="text-sm font-medium text-foreground">Glisser-déposer ici</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                ou cliquez pour parcourir vos fichiers (PNG, JPG)
              </p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <div className="rounded-2xl border border-zinc-200 bg-surface p-4 dark:border-white/10">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Aperçu rapide
          </p>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
            {imagePreviewUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- same local preview as above
              <img src={imagePreviewUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
          </div>
          <div className="mt-3 space-y-1">
            {trimmedCategoryInput && <CategoryTag name={trimmedCategoryInput} />}
            <p className="line-clamp-1 text-sm font-semibold text-foreground">
              {title || "Titre de l'article"}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {price ? formatPrice(priceValue) : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Titre de l'article">
          <input
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Veste en cuir vintage"
            className={inputClass}
          />
        </Field>

        <Field label="Prix (FCFA)">
          <input
            type="number"
            required
            min={1}
            step={1}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </Field>

        <div className="relative">
          <Field label="Genre / Catégorie">
            <input
              type="text"
              required
              value={categoryInput}
              onChange={(event) => handleCategoryInputChange(event.target.value)}
              onFocus={() => setIsCategoryDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 150)}
              placeholder="Sélectionner ou créer une catégorie"
              className={inputClass}
            />
          </Field>

          {isCategoryDropdownOpen && (filteredCategories.length > 0 || canCreateCategory) && (
            <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-zinc-200 bg-surface shadow-lg dark:border-white/10">
              {filteredCategories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectCategory(category)}
                    className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-zinc-100 dark:hover:bg-white/5"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
              {canCreateCategory && (
                <li>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={handleCreateCategory}
                    disabled={isCreatingCategory}
                    className="block w-full border-t border-zinc-200 px-3 py-2 text-left text-sm font-medium text-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10"
                  >
                    {isCreatingCategory
                      ? 'Création...'
                      : `+ Créer la catégorie "${trimmedCategoryInput}"`}
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>

        <Field label="Quantité">
          <input
            type="number"
            required
            min={0}
            step={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </Field>

        <Field label="Taille (optionnel)">
          <input
            type="text"
            value={size}
            onChange={(event) => setSize(event.target.value)}
            placeholder="Ex: M, 42, Taille unique"
            className={inputClass}
          />
        </Field>
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <Link
          href="/admin/articles"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-foreground hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function UploadIcon({ className }: { className?: string }) {
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
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
