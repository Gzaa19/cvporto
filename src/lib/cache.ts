/**
 * Simple in-memory cache for server-side data.
 * Supports TTL (time-to-live) and tag-based invalidation.
 * Perfect for single-server deployment handling thousands of requests.
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
    tags: string[];
}

class ServerCache {
    private cache = new Map<string, CacheEntry<unknown>>();
    private maxEntries = 500; // Prevent unbounded memory growth

    /**
     * Get cached data or fetch fresh data if expired/missing.
     * @param key - Unique cache key
     * @param fetcher - Async function to fetch data on cache miss
     * @param ttlSeconds - Time-to-live in seconds (default: 60s)
     * @param tags - Tags for group invalidation
     */
    async getOrFetch<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttlSeconds: number = 60,
        tags: string[] = []
    ): Promise<T> {
        const existing = this.cache.get(key) as CacheEntry<T> | undefined;

        if (existing && Date.now() < existing.expiresAt) {
            return existing.data;
        }

        const data = await fetcher();

        // Evict oldest entries if cache is too large
        if (this.cache.size >= this.maxEntries) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttlSeconds * 1000,
            tags,
        });

        return data;
    }

    /**
     * Invalidate all cache entries matching any of the given tags.
     */
    invalidateByTags(tags: string[]) {
        const tagsSet = new Set(tags);
        for (const [key, entry] of this.cache.entries()) {
            if (entry.tags.some(t => tagsSet.has(t))) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Invalidate a specific cache key.
     */
    invalidate(key: string) {
        this.cache.delete(key);
    }

    /**
     * Clear all cache entries.
     */
    clear() {
        this.cache.clear();
    }
}

// Singleton instance - persists across requests in the same server process
const globalForCache = globalThis as unknown as {
    serverCache: ServerCache | undefined;
};

export const serverCache = globalForCache.serverCache ?? new ServerCache();
globalForCache.serverCache = serverCache;
