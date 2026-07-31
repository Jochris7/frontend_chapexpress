export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800"
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
