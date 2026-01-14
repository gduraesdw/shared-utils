import { debounce, throttle, memoize, once } from '../../src/performance/optimize';

describe('Performance Optimization Utilities', () => {
  jest.useFakeTimers();

  describe('debounce', () => {
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
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle different arguments', () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(10)).toBe(20);

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('once', () => {
    it('should execute function only once', () => {
      const fn = jest.fn(() => 42);
      const onceFn = once(fn);

      expect(onceFn()).toBe(42);
      expect(onceFn()).toBe(42);
      expect(onceFn()).toBe(42);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
