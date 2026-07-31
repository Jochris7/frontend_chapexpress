'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import { getProductById } from '@/lib/api';
import { ProductForm } from '@/components/admin/ProductForm';
import { setFlashMessage } from '@/lib/flash';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

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

  const handleSuccess = () => {
    setFlashMessage('Article modifié avec succès');
    router.push('/admin/articles');
  };

  if (product === undefined) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Chargement...</p>;
  }

  if (product === null) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Article introuvable.</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Modifier l&apos;article</h1>
      <ProductForm mode="edit" product={product} onSuccess={handleSuccess} />
    </div>
  );
}
