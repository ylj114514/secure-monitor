export const REFRESH_EVENT = "securemonitor:refresh";

export function emitGlobalRefresh(delayMs = 0) {
  window.setTimeout(() => {
    window.dispatchEvent(new Event(REFRESH_EVENT));
  }, delayMs);
}

export function onGlobalRefresh(handler: () => void) {
  window.addEventListener(REFRESH_EVENT, handler);
  return () => window.removeEventListener(REFRESH_EVENT, handler);
}
