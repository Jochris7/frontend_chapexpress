'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { setFlashMessage } from '@/lib/flash';

export default function NewArticlePage() {
  const router = useRouter();

  const handleSuccess = () => {
    setFlashMessage('Article créé avec succès');
    router.push('/admin/articles');
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Ajouter un article</h1>
      <ProductForm mode="create" onSuccess={handleSuccess} />
    </div>
  );
}
