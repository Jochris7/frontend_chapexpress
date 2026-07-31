import type { Category } from '@/types';

interface CategoryFilterBarProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilterBar({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterPill label="Tous" isActive={activeCategoryId === null} onClick={() => onSelect(null)} />
      {categories.map((category) => (
        <FilterPill
          key={category.id}
          label={category.name}
          isActive={activeCategoryId === category.id}
          onClick={() => onSelect(category.id)}
        />
      ))}
    </div>
  );
}

function FilterPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-accent text-black'
          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
      }`}
    >
      {label}
    </button>
  );
}
