import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { CategoryTag } from '@/components/CategoryTag';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produit/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-surface transition-shadow hover:shadow-lg dark:border-zinc-800"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1 p-4">
        <CategoryTag name={product.category.name} />
        <h3 className="line-clamp-1 font-semibold text-foreground">{product.title}</h3>
        <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
