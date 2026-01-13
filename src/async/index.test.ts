import {
  retry,
  debounce,
  throttle,
  sleep,
  withTimeout,
  batchProcess,
  sequential,
  memoize,
} from '../async';

describe('Async utilities', () => {
  describe('retry', () => {
    it('should retry on failure and succeed', async () => {
      let attempts = 0;
      const fn = jest.fn(async () => {
        attempts++;
        if (attempts < 3) throw new Error('Failed');
        return 'success';
      });

      const result = await retry(fn, { maxAttempts: 3, delay: 1 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    }, 10000);

    it('should throw after max attempts', async () => {
      const fn = jest.fn(async () => {
        throw new Error('Always fails');
      });

      await expect(retry(fn, { maxAttempts: 2, delay: 1 })).rejects.toThrow('Always fails');
      expect(fn).toHaveBeenCalledTimes(2);
    }, 10000);

    it('should use exponential backoff', async () => {
      const fn = jest.fn(async () => {
        throw new Error('Failed');
      });

      const startTime = Date.now();
      await retry(fn, {
        maxAttempts: 3,
        delay: 10,
        backoffMultiplier: 2,
      }).catch(() => {});
      const duration = Date.now() - startTime;

      // Should wait: 10ms + 20ms = 30ms (plus execution time)
      expect(duration).toBeGreaterThanOrEqual(30);
    }, 10000);

    it('should respect shouldRetry function', async () => {
      const fn = jest.fn(async () => {
        throw new Error('Do not retry');
      });

      await expect(
        retry(fn, {
          maxAttempts: 3,
          delay: 1,
          shouldRetry: (error: any) => !error.message.includes('Do not retry'),
        })
      ).rejects.toThrow();

      expect(fn).toHaveBeenCalledTimes(1);
    }, 10000);
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call with latest arguments', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith('third');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle function calls', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should call with last arguments after throttle period', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled('first');
      throttled('second');

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith('second');
    });
  });

  describe('sleep', () => {
    it('should delay execution', async () => {
      const startTime = Date.now();
      await sleep(50);
      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(50);
    });
  });

  describe('withTimeout', () => {
    it('should resolve if function completes within timeout', async () => {
      const fn = async () => {
        await sleep(10);
        return 'success';
      };

      const result = await withTimeout(fn, 50);
      expect(result).toBe('success');
    });

    it('should reject if function exceeds timeout', async () => {
      const fn = async () => {
        await sleep(100);
        return 'success';
      };

      await expect(withTimeout(fn, 10)).rejects.toThrow('Operation timed out');
    });
  });

  describe('batchProcess', () => {
    it('should process items in batches', async () => {
      const items = [1, 2, 3, 4, 5];
      const fn = jest.fn(async (item: number) => item * 2);

      const results = await batchProcess(items, 2, fn);

      expect(results).toEqual([2, 4, 6, 8, 10]);
      expect(fn).toHaveBeenCalledTimes(5);
    });

    it('should handle empty array', async () => {
      const results = await batchProcess([], 2, async (item) => item);
      expect(results).toEqual([]);
    });
  });

  describe('sequential', () => {
    it('should execute functions sequentially', async () => {
      const order: number[] = [];
      const fns = [
        async () => {
          await sleep(20);
          order.push(1);
          return 1;
        },
        async () => {
          await sleep(10);
          order.push(2);
          return 2;
        },
        async () => {
          order.push(3);
          return 3;
        },
      ];

      const results = await sequential(fns);

      expect(results).toEqual([1, 2, 3]);
      expect(order).toEqual([1, 2, 3]);
    });
  });

  describe('memoize', () => {
    it('should memoize async function results', async () => {
      let callCount = 0;
      const fn = jest.fn(async (x: number) => {
        callCount++;
        return x * 2;
      });

      const memoized = memoize(fn);

      const result1 = await memoized(5);
      const result2 = await memoized(5);
      const result3 = await memoized(10);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(result3).toBe(20);
      expect(callCount).toBe(2); // Called only for unique arguments
    });

    it('should handle different argument combinations', async () => {
      const fn = memoize(async (a: number, b: number) => a + b);

      const result1 = await fn(1, 2);
      const result2 = await fn(1, 2);
      const result3 = await fn(2, 1);

      expect(result1).toBe(3);
      expect(result2).toBe(3);
      expect(result3).toBe(3);
    });
  });
});
