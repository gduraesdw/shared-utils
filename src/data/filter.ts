/**
 * Utilitários de filtragem e busca em coleções
 */

/**
 * Filtra um array removendo valores falsy
 * @param array - Array a ser filtrado
 * @returns Array sem valores falsy
 */
export function compact<T>(array: (T | null | undefined | false | '' | 0)[]): T[] {
  return array.filter(Boolean) as T[];
}

/**
 * Remove duplicatas de um array
 * @param array - Array com possíveis duplicatas
 * @returns Array sem duplicatas
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Remove duplicatas de um array baseado em uma função
 * @param array - Array com possíveis duplicatas
 * @param fn - Função para extrair o valor único
 * @returns Array sem duplicatas
 */
export function uniqueBy<T>(array: T[], fn: (item: T) => unknown): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = fn(item);
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Agrupa elementos de um array por uma função
 * @param array - Array a ser agrupado
 * @param fn - Função para determinar o grupo
 * @returns Objeto com os grupos
 */
export function groupBy<T>(array: T[], fn: (item: T) => string): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key = fn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Particiona um array em dois baseado em uma condição
 * @param array - Array a ser particionado
 * @param predicate - Função de condição
 * @returns Tupla com arrays [verdadeiros, falsos]
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];

  array.forEach((item) => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });

  return [truthy, falsy];
}

/**
 * Busca em um array de objetos por propriedades
 * @param array - Array de objetos
 * @param query - Objeto com propriedades para buscar
 * @returns Array filtrado
 */
export function findWhere<T extends Record<string, unknown>>(array: T[], query: Partial<T>): T[] {
  return array.filter((item) => {
    return Object.keys(query).every((key) => {
      return item[key] === query[key];
    });
  });
}

/**
 * Realiza busca fuzzy em um array de strings
 * @param array - Array de strings
 * @param query - String de busca
 * @returns Array filtrado e ordenado por relevância
 */
export function fuzzySearch(array: string[], query: string): string[] {
  const lowerQuery = query.toLowerCase();

  return array
    .map((item) => {
      const lowerItem = item.toLowerCase();
      let score = 0;

      // Exact match
      if (lowerItem === lowerQuery) {
        score = 1000;
      }
      // Starts with
      else if (lowerItem.startsWith(lowerQuery)) {
        score = 100;
      }
      // Contains
      else if (lowerItem.includes(lowerQuery)) {
        score = 10;
      }
      // Fuzzy match
      else {
        let queryIndex = 0;
        for (let i = 0; i < lowerItem.length && queryIndex < lowerQuery.length; i++) {
          if (lowerItem[i] === lowerQuery[queryIndex]) {
            queryIndex++;
            score++;
          }
        }
        if (queryIndex !== lowerQuery.length) {
          score = 0;
        }
      }

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

/**
 * Ordena um array de objetos por múltiplas propriedades
 * @param array - Array a ser ordenado
 * @param keys - Array de chaves para ordenação
 * @param orders - Array de ordens ('asc' ou 'desc')
 * @returns Array ordenado
 */
export function sortBy<T extends Record<string, unknown>>(
  array: T[],
  keys: (keyof T)[],
  orders: ('asc' | 'desc')[] = []
): T[] {
  return [...array].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const order = orders[i] || 'asc';
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Divide um array em chunks de tamanho específico
 * @param array - Array a ser dividido
 * @param size - Tamanho de cada chunk
 * @returns Array de arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) throw new Error('Chunk size must be greater than 0');

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
