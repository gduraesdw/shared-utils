import {
  getItem,
  setItem,
  removeItem,
  clear,
  hasItem,
  getAllKeys,
  createNamespacedStorage,
} from '../storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

global.localStorage = localStorageMock as Storage;

describe('Storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getItem', () => {
    it('should get item from localStorage', () => {
      localStorage.setItem('test', JSON.stringify({ value: 'hello' }));
      const result = getItem<{ value: string }>('test');
      expect(result).toEqual({ value: 'hello' });
    });

    it('should return default value when item does not exist', () => {
      const result = getItem('nonexistent', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('should return null when item does not exist and no default', () => {
      const result = getItem('nonexistent');
      expect(result).toBeNull();
    });

    it('should handle parse errors gracefully', () => {
      localStorage.setItem('bad', 'invalid json');
      const result = getItem('bad', { fallback: true });
      expect(result).toEqual({ fallback: true });
    });
  });

  describe('setItem', () => {
    it('should set item in localStorage', () => {
      const data = { name: 'John', age: 30 };
      const result = setItem('user', data);
      expect(result).toBe(true);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(data));
    });

    it('should handle primitive values', () => {
      setItem('string', 'hello');
      setItem('number', 42);
      setItem('boolean', true);

      expect(getItem('string')).toBe('hello');
      expect(getItem('number')).toBe(42);
      expect(getItem('boolean')).toBe(true);
    });

    it('should handle errors when setting fails', () => {
      // Mock setItem to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage full');
      });

      const result = setItem('test', 'value');
      expect(result).toBe(false);

      // Restore
      localStorage.setItem = originalSetItem;
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test', 'value');
      const result = removeItem('test');
      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBeNull();
    });

    it('should handle errors when removing fails', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('Remove failed');
      });

      const result = removeItem('test');
      expect(result).toBe(false);

      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('clear', () => {
    it('should clear all items from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      const result = clear();
      expect(result).toBe(true);
      expect(localStorage.length).toBe(0);
    });

    it('should handle errors when clearing fails', () => {
      const originalClear = localStorage.clear;
      localStorage.clear = jest.fn(() => {
        throw new Error('Clear failed');
      });

      const result = clear();
      expect(result).toBe(false);

      localStorage.clear = originalClear;
    });
  });

  describe('hasItem', () => {
    it('should return true if item exists', () => {
      localStorage.setItem('test', 'value');
      expect(hasItem('test')).toBe(true);
    });

    it('should return false if item does not exist', () => {
      expect(hasItem('nonexistent')).toBe(false);
    });
  });

  describe('getAllKeys', () => {
    it('should return all keys from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      const keys = getAllKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
      expect(keys.length).toBe(3);
    });

    it('should return empty array when localStorage is empty', () => {
      const keys = getAllKeys();
      expect(keys).toEqual([]);
    });
  });

  describe('createNamespacedStorage', () => {
    it('should create namespaced storage', () => {
      const userStorage = createNamespacedStorage('user');

      userStorage.setItem('profile', { name: 'John' });
      expect(localStorage.getItem('user:profile')).toBe(JSON.stringify({ name: 'John' }));
    });

    it('should get namespaced item', () => {
      const userStorage = createNamespacedStorage('user');
      userStorage.setItem('profile', { name: 'John' });

      const result = userStorage.getItem('profile');
      expect(result).toEqual({ name: 'John' });
    });

    it('should check namespaced item existence', () => {
      const userStorage = createNamespacedStorage('user');
      userStorage.setItem('profile', { name: 'John' });

      expect(userStorage.hasItem('profile')).toBe(true);
      expect(userStorage.hasItem('nonexistent')).toBe(false);
    });

    it('should remove namespaced item', () => {
      const userStorage = createNamespacedStorage('user');
      userStorage.setItem('profile', { name: 'John' });
      userStorage.removeItem('profile');

      expect(userStorage.hasItem('profile')).toBe(false);
    });

    it('should clear only namespaced items', () => {
      const userStorage = createNamespacedStorage('user');
      const appStorage = createNamespacedStorage('app');

      userStorage.setItem('profile', { name: 'John' });
      appStorage.setItem('settings', { theme: 'dark' });
      localStorage.setItem('global', 'value');

      userStorage.clear();

      expect(userStorage.hasItem('profile')).toBe(false);
      expect(appStorage.hasItem('settings')).toBe(true);
      expect(localStorage.getItem('global')).toBe('value');
    });
  });
});
