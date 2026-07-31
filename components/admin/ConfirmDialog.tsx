export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  isConfirming,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-surface p-6 dark:border-white/10">
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? 'Suppression...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
