import { canUseDOM } from "@shared/lib/dom/canUseDOM";

export function safeGetItem(key: string): string | null {
  if (!canUseDOM) return null;

  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    console.error(`[storage] Failed to read key ${key}`, e);
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  if (!canUseDOM) return;

  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    console.error(`[storage] Failed to write key ${key}`, e);
  }
}

export function safeRemoveItem(key: string): void {
  if (!canUseDOM) return;

  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.error(`[storage] Failed to remove key ${key}`, e);
  }
}
