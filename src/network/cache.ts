/**
 * Utilitários de cache
 */

/**
 * Estratégia de cache
 */
export type CacheStrategy = 'memory' | 'sessionStorage' | 'localStorage';

/**
 * Interface de cache
 */
export interface CacheInterface {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
}

/**
 * Cache em memória
 */
export class MemoryCache implements CacheInterface {
  private cache = new Map<string, { value: unknown; expiry?: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl : undefined;
    this.cache.set(key, { value, expiry });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * Cache em storage (localStorage ou sessionStorage)
 */
export class StorageCache implements CacheInterface {
  private storage: Storage;
  private prefix: string;

  constructor(strategy: 'localStorage' | 'sessionStorage' = 'localStorage', prefix = 'cache_') {
    this.storage = strategy === 'localStorage' ? localStorage : sessionStorage;
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(this.getKey(key));

      if (!item) {
        return null;
      }

      const parsed = JSON.parse(item);

      if (parsed.expiry && parsed.expiry < Date.now()) {
        this.delete(key);
        return null;
      }

      return parsed.value as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T, ttl?: number): void {
    try {
      const expiry = ttl ? Date.now() + ttl : undefined;
      const item = JSON.stringify({ value, expiry });
      this.storage.setItem(this.getKey(key), item);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  clear(): void {
    const keys = Object.keys(this.storage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    });
  }
}

/**
 * Cache manager que suporta múltiplas estratégias
 */
export class CacheManager {
  private caches: Map<CacheStrategy, CacheInterface> = new Map();

  constructor() {
    this.caches.set('memory', new MemoryCache());

    if (typeof window !== 'undefined') {
      if (window.localStorage) {
        this.caches.set('localStorage', new StorageCache('localStorage'));
      }
      if (window.sessionStorage) {
        this.caches.set('sessionStorage', new StorageCache('sessionStorage'));
      }
    }
  }

  getCache(strategy: CacheStrategy): CacheInterface {
    const cache = this.caches.get(strategy);
    if (!cache) {
      throw new Error(`Cache strategy "${strategy}" not available`);
    }
    return cache;
  }

  get<T>(key: string, strategy: CacheStrategy = 'memory'): T | null {
    return this.getCache(strategy).get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number, strategy: CacheStrategy = 'memory'): void {
    this.getCache(strategy).set(key, value, ttl);
  }

  has(key: string, strategy: CacheStrategy = 'memory'): boolean {
    return this.getCache(strategy).has(key);
  }

  delete(key: string, strategy: CacheStrategy = 'memory'): void {
    this.getCache(strategy).delete(key);
  }

  clear(strategy?: CacheStrategy): void {
    if (strategy) {
      this.getCache(strategy).clear();
    } else {
      this.caches.forEach((cache) => cache.clear());
    }
  }
}

/**
 * Decorator para cachear resultados de funções
 * @param keyGenerator - Função para gerar a chave do cache
 * @param ttl - Tempo de vida do cache em ms
 * @param strategy - Estratégia de cache
 * @returns Decorator
 */
export function cacheable(
  keyGenerator: (...args: unknown[]) => string,
  ttl?: number,
  strategy: CacheStrategy = 'memory'
): MethodDecorator {
  const cacheManager = new CacheManager();

  return function (
    _target: unknown,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const cacheKey = keyGenerator(...args);
      const cached = cacheManager.get(cacheKey, strategy);

      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      cacheManager.set(cacheKey, result, ttl, strategy);

      return result;
    };

    return descriptor;
  };
}

/**
 * LRU Cache (Least Recently Used)
 */
export class LRUCache<K, V> {
  private maxSize: number;
  private cache: Map<K, V>;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    const value = this.cache.get(key)!;
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    if (this.cache.size > this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
