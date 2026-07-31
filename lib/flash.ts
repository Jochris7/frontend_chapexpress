const STORAGE_KEY = 'chapexpress-admin-flash';

// One-off toast message carried across a redirect (e.g. create/edit -> list)
// without a global toast store: written before router.push, read and
// cleared on the destination page's mount.
export function setFlashMessage(message: string): void {
  window.sessionStorage.setItem(STORAGE_KEY, message);
}

export function consumeFlashMessage(): string | null {
  const message = window.sessionStorage.getItem(STORAGE_KEY);
  if (message) window.sessionStorage.removeItem(STORAGE_KEY);
  return message;
}
