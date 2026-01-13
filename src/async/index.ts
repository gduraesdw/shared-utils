/**
 * Async utility functions.
 */

/**
 * Options for the retry function.
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxAttempts?: number;
  /** Initial delay between retries in milliseconds */
  delay?: number;
  /** Multiplier for exponential backoff */
  backoffMultiplier?: number;
  /** Maximum delay between retries in milliseconds */
  maxDelay?: number;
  /** Function to determine if error should trigger retry */
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Retries an async function with exponential backoff.
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns Promise with the result of the function
 * @example
 * const data = await retry(() => fetchData(), { maxAttempts: 3, delay: 1000 });
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffMultiplier = 2,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      await sleep(Math.min(currentDelay, maxDelay));
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError;
}

/**
 * Creates a debounced function that delays execution.
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 * debouncedSearch('hello'); // Only executes after 300ms of inactivity
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Creates a throttled function that limits execution rate.
 * @param fn - The function to throttle
 * @param limit - Minimum time between executions in milliseconds
 * @returns Throttled function
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  let lastContext: unknown = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        if (lastArgs !== null) {
          fn.apply(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastContext = this;
    }
  };
}

/**
 * Delays execution for a specified time.
 * @param ms - Delay in milliseconds
 * @returns Promise that resolves after the delay
 * @example
 * await sleep(1000); // Wait for 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes an async function with a timeout.
 * @param fn - The async function to execute
 * @param timeout - Timeout in milliseconds
 * @returns Promise with the result or timeout error
 * @example
 * const data = await withTimeout(() => fetchData(), 5000);
 */
export async function withTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeout)
    ),
  ]);
}

/**
 * Executes multiple promises in batches.
 * @param items - Array of items to process
 * @param batchSize - Number of items to process in parallel
 * @param fn - Function to execute for each item
 * @returns Promise with array of results
 * @example
 * const results = await batchProcess(ids, 5, (id) => fetchUser(id));
 */
export async function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }

  return results;
}

/**
 * Executes promises sequentially.
 * @param fns - Array of functions that return promises
 * @returns Promise with array of results
 * @example
 * const results = await sequential([() => task1(), () => task2()]);
 */
export async function sequential<T>(fns: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];

  for (const fn of fns) {
    results.push(await fn());
  }

  return results;
}

/**
 * Memoizes an async function based on arguments.
 * @param fn - The async function to memoize
 * @returns Memoized function
 * @example
 * const memoizedFetch = memoize(fetchUser);
 * await memoizedFetch(1); // Fetches and caches
 * await memoizedFetch(1); // Returns cached result
 */
export function memoize<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T
): T {
  const cache = new Map<string, unknown>();

  return (async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = await fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
