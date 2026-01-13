import {
  unique,
  chunk,
  flatten,
  groupBy,
  compact,
  difference,
  intersection,
  shuffle,
  sample,
  uniqueBy,
} from './array';

describe('Array utilities', () => {
  describe('unique', () => {
    it('should return unique values', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe('chunk', () => {
    it('should chunk array into specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(flatten([1, [2, [3, 4]]])).toEqual([1, 2, 3, 4]);
      expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle already flat arrays', () => {
      expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      expect(flatten([])).toEqual([]);
    });
  });

  describe('groupBy', () => {
    it('should group by key function', () => {
      const items = [
        { age: 20, name: 'Alice' },
        { age: 30, name: 'Bob' },
        { age: 20, name: 'Charlie' },
      ];
      const result = groupBy(items, (item) => item.age);

      expect(result['20']).toHaveLength(2);
      expect(result['30']).toHaveLength(1);
    });

    it('should handle empty array', () => {
      expect(groupBy([], (item) => item)).toEqual({});
    });
  });

  describe('compact', () => {
    it('should remove falsy values', () => {
      expect(compact([0, 1, false, 2, '', 3, null, undefined])).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      expect(compact([])).toEqual([]);
    });

    it('should handle array with no falsy values', () => {
      expect(compact([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('difference', () => {
    it('should return difference between arrays', () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
      expect(difference([1, 2, 3, 4], [3, 4, 5])).toEqual([1, 2]);
    });

    it('should handle no difference', () => {
      expect(difference([1, 2], [1, 2])).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(difference([], [1, 2])).toEqual([]);
      expect(difference([1, 2], [])).toEqual([1, 2]);
    });
  });

  describe('intersection', () => {
    it('should return intersection of arrays', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
      expect(intersection([1, 2, 3], [3, 4, 5])).toEqual([3]);
    });

    it('should handle no intersection', () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(intersection([], [1, 2])).toEqual([]);
      expect(intersection([1, 2], [])).toEqual([]);
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);

      expect(shuffled).toHaveLength(arr.length);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3];
      shuffle(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('sample', () => {
    it('should return random element', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sample(arr);

      expect(arr).toContain(result);
    });

    it('should return undefined for empty array', () => {
      expect(sample([])).toBeUndefined();
    });
  });

  describe('uniqueBy', () => {
    it('should return unique objects by key', () => {
      const items = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Charlie' },
      ];
      const result = uniqueBy(items, (item) => item.id);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should handle empty array', () => {
      expect(uniqueBy([], (item) => item)).toEqual([]);
    });
  });
});
