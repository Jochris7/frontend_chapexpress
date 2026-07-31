export function Toast({ message, isVisible }: { message: string; isVisible: boolean }) {
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="pointer-events-auto rounded-full bg-chrome px-5 py-3 text-sm font-medium text-chrome-foreground shadow-lg">
        {message}
      </div>
    </div>
  );
}
