import {
  deepClone,
  deepMerge,
  flattenObject,
  unflattenObject,
  mapValues,
  omit,
  pick,
} from '../../src/data/transform';

describe('Data Transform Utilities', () => {
  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, [3, 4]];
      const cloned = deepClone(arr);

      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone dates', () => {
      const date = new Date('2024-01-01');
      const cloned = deepClone(date);

      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });
  });

  describe('deepMerge', () => {
    it('should merge two objects', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { b: { d: 3 }, e: 4 };
      const merged = deepMerge(obj1, obj2);

      expect(merged).toEqual({
        a: 1,
        b: { c: 2, d: 3 },
        e: 4,
      });
    });

    it('should override values', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 2 };
      const merged = deepMerge(obj1, obj2);

      expect(merged.a).toBe(2);
    });
  });

  describe('flattenObject', () => {
    it('should flatten nested object', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      };

      expect(flattenObject(obj)).toEqual({
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
      });
    });
  });

  describe('unflattenObject', () => {
    it('should unflatten object', () => {
      const flattened = {
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
      };

      expect(unflattenObject(flattened)).toEqual({
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      });
    });
  });

  describe('mapValues', () => {
    it('should map object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const mapped = mapValues(obj, (val) => val * 2);

      expect(mapped).toEqual({ a: 2, b: 4, c: 6 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['b']);

      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pick(obj, ['a', 'c']);

      expect(result).toEqual({ a: 1, c: 3 });
    });
  });
});
