import {
  pick,
  omit,
  deepMerge,
  isObject,
  deepClone,
  getProperty,
  setProperty,
  isEmpty,
  invert,
} from './object';

describe('Object utilities', () => {
  describe('pick', () => {
    it('should pick specified properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, ['a', 'c'] as any)).toEqual({ a: 1 });
    });
  });

  describe('omit', () => {
    it('should omit specified properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, ['c'] as any)).toEqual({ a: 1, b: 2 });
    });
  });

  describe('deepMerge', () => {
    it('should deep merge objects', () => {
      const target = { a: { b: 1 } };
      const source = { a: { c: 2 } };
      expect(deepMerge(target, source)).toEqual({ a: { b: 1, c: 2 } });
    });

    it('should merge multiple sources', () => {
      const result = deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should override primitives', () => {
      const result = deepMerge({ a: 1 }, { a: 2 });
      expect(result).toEqual({ a: 2 });
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(1)).toBe(false);
      expect(isObject('string')).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should deep clone objects', () => {
      const obj = { a: { b: { c: 1 } } };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.a).not.toBe(obj.a);
    });

    it('should clone arrays', () => {
      const arr = [1, [2, 3]];
      const cloned = deepClone(arr);

      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
    });

    it('should clone dates', () => {
      const date = new Date('2024-01-15');
      const cloned = deepClone(date);

      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });

    it('should handle primitives', () => {
      expect(deepClone(1)).toBe(1);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(null)).toBe(null);
    });
  });

  describe('getProperty', () => {
    it('should get nested property value', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(getProperty(obj, 'a.b.c')).toBe(1);
    });

    it('should return default value for non-existent path', () => {
      const obj = { a: { b: 1 } };
      expect(getProperty(obj, 'a.b.c', 'default')).toBe('default');
    });

    it('should handle null/undefined in path', () => {
      const obj = { a: null };
      expect(getProperty(obj, 'a.b.c', 'default')).toBe('default');
    });
  });

  describe('setProperty', () => {
    it('should set nested property value', () => {
      const obj = {};
      setProperty(obj, 'a.b.c', 1);
      expect(obj).toEqual({ a: { b: { c: 1 } } });
    });

    it('should override existing values', () => {
      const obj = { a: { b: 1 } };
      setProperty(obj, 'a.b', 2);
      expect(obj).toEqual({ a: { b: 2 } });
    });

    it('should create intermediate objects', () => {
      const obj = { a: 1 };
      setProperty(obj, 'b.c.d', 2);
      expect(obj).toEqual({ a: 1, b: { c: { d: 2 } } });
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('invert', () => {
    it('should invert object keys and values', () => {
      expect(invert({ a: '1', b: '2' })).toEqual({ '1': 'a', '2': 'b' });
    });

    it('should handle numeric values', () => {
      expect(invert({ a: 1, b: 2 })).toEqual({ '1': 'a', '2': 'b' });
    });
  });
});
