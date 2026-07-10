/**
 * CMS Response Cache
 * Caches API responses in localStorage. Data is served instantly from cache
 * and refreshed in background. Cache is only cleared when CMS data changes.
 */

const CACHE_PREFIX = 'cms_v1_';

type CacheEntry<T> = {
  data: T;
  hash: string;
  timestamp: number;
};

function computeHash(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T): boolean {
  try {
    const newHash = computeHash(data);
    const existing = localStorage.getItem(CACHE_PREFIX + key);

    if (existing) {
      const old: CacheEntry<T> = JSON.parse(existing);
      if (old.hash === newHash) {
        return false; // Data hasn't changed
      }
    }

    const entry: CacheEntry<T> = {
      data,
      hash: newHash,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    return true; // Data changed
  } catch {
    return true;
  }
}

export function clearAllCache(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // Storage unavailable
  }
}
