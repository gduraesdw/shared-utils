/**
 * Utilitários de otimização de performance
 */

/**
 * Cria uma versão debounced de uma função
 * @param func - Função a ser debounced
 * @param delay - Delay em milissegundos
 * @returns Função debounced
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Cria uma versão throttled de uma função
 * @param func - Função a ser throttled
 * @param limit - Limite em milissegundos
 * @returns Função throttled
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func.apply(this, args) as ReturnType<T>;
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }

    return lastResult;
  };
}

/**
 * Memoiza uma função (cache de resultados)
 * @param func - Função a ser memoizada
 * @param resolver - Função para gerar a chave do cache
 * @returns Função memoizada
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T & { cache: Map<string, ReturnType<T>> } {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func.apply(this, args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  } as T & { cache: Map<string, ReturnType<T>> };

  memoized.cache = cache;

  return memoized;
}

/**
 * Limpa o cache de uma função memoizada
 * @param memoizedFunc - Função memoizada
 */
export function clearMemoizeCache<T extends (...args: unknown[]) => unknown>(
  memoizedFunc: T & { cache?: Map<string, unknown> }
): void {
  if (memoizedFunc.cache) {
    memoizedFunc.cache.clear();
  }
}

/**
 * Cria uma função que só pode ser executada uma vez
 * @param func - Função a ser executada
 * @returns Função que só executa uma vez
 */
export function once<T extends (...args: unknown[]) => unknown>(func: T): T {
  let called = false;
  let result: ReturnType<T>;

  return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = func.apply(this, args) as ReturnType<T>;
    }
    return result;
  } as T;
}

/**
 * Lazy load - executa uma função apenas quando necessário
 * @param factory - Função factory
 * @returns Função que retorna o valor lazy
 */
export function lazy<T>(factory: () => T): () => T {
  let cached: T | undefined;
  let initialized = false;

  return () => {
    if (!initialized) {
      cached = factory();
      initialized = true;
    }
    return cached as T;
  };
}

/**
 * Executa ações em lote com delay
 * @param tasks - Array de funções a serem executadas
 * @param batchSize - Tamanho do lote
 * @param delay - Delay entre lotes em ms
 * @returns Promise que resolve quando todas as tarefas forem concluídas
 */
export async function batchProcess<T>(
  tasks: (() => T | Promise<T>)[],
  batchSize: number,
  delay = 0
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((task) => task()));
    results.push(...batchResults);

    if (i + batchSize < tasks.length && delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
}

/**
 * Cria um pool de recursos reutilizáveis
 * @param factory - Função para criar recursos
 * @param maxSize - Tamanho máximo do pool
 * @returns Objeto com métodos acquire e release
 */
export function createPool<T>(factory: () => T, maxSize = 10): {
  acquire: () => T;
  release: (resource: T) => void;
  size: () => number;
} {
  const available: T[] = [];
  const inUse = new Set<T>();

  return {
    acquire: (): T => {
      if (available.length > 0) {
        const resource = available.pop()!;
        inUse.add(resource);
        return resource;
      }

      if (inUse.size < maxSize) {
        const resource = factory();
        inUse.add(resource);
        return resource;
      }

      throw new Error('Pool exhausted');
    },

    release: (resource: T): void => {
      if (inUse.has(resource)) {
        inUse.delete(resource);
        available.push(resource);
      }
    },

    size: (): number => {
      return available.length + inUse.size;
    },
  };
}

/**
 * Measure execution time of a function
 * @param func - Function to measure
 * @param label - Label for the measurement
 * @returns Function that returns both result and execution time
 */
export async function measureTime<T>(
  func: () => T | Promise<T>,
  label = 'Execution'
): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await func();
  const end = performance.now();
  const time = end - start;

  console.log(`${label} took ${time.toFixed(2)}ms`);

  return { result, time };
}

/**
 * Retry a function with exponential backoff
 * @param func - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise with the result
 */
export async function retryWithBackoff<T>(
  func: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await func();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
