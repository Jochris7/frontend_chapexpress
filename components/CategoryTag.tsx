export function CategoryTag({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
      {name}
    </span>
  );
}
