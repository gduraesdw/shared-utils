/**
 * Utilitários de normalização de dados
 */

/**
 * Normaliza um array de objetos em um formato de entidades com IDs
 * @param array - Array de objetos
 * @param idKey - Chave que contém o ID
 * @returns Objeto normalizado com IDs como chaves
 */
export function normalizeById<T extends Record<string, unknown>>(
  array: T[],
  idKey: keyof T = 'id' as keyof T
): Record<string, T> {
  return array.reduce((acc, item) => {
    const id = String(item[idKey]);
    acc[id] = item;
    return acc;
  }, {} as Record<string, T>);
}

/**
 * Desnormaliza um objeto de entidades de volta para um array
 * @param normalized - Objeto normalizado
 * @returns Array de objetos
 */
export function denormalizeById<T>(normalized: Record<string, T>): T[] {
  return Object.values(normalized);
}

/**
 * Normaliza valores numéricos para um intervalo específico
 * @param value - Valor a ser normalizado
 * @param min - Valor mínimo do intervalo original
 * @param max - Valor máximo do intervalo original
 * @param targetMin - Valor mínimo do intervalo alvo (padrão: 0)
 * @param targetMax - Valor máximo do intervalo alvo (padrão: 1)
 * @returns Valor normalizado
 */
export function normalizeNumber(
  value: number,
  min: number,
  max: number,
  targetMin = 0,
  targetMax = 1
): number {
  if (max === min) return targetMin;
  return ((value - min) / (max - min)) * (targetMax - targetMin) + targetMin;
}

/**
 * Normaliza uma string removendo acentos e caracteres especiais
 * @param str - String a ser normalizada
 * @returns String normalizada
 */
export function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Normaliza um array de strings removendo duplicatas e ordenando
 * @param array - Array de strings
 * @returns Array normalizado
 */
export function normalizeStringArray(array: string[]): string[] {
  return Array.from(new Set(array.map((s) => s.trim()))).sort();
}

/**
 * Converte chaves de objeto para camelCase
 * @param obj - Objeto a ser convertido
 * @returns Objeto com chaves em camelCase
 */
export function camelCaseKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => camelCaseKeys(item));
  }

  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = obj[key];

      if (typeof value === 'object' && value !== null) {
        result[camelKey] = camelCaseKeys(value as Record<string, unknown>);
      } else {
        result[camelKey] = value;
      }
    }
  }

  return result;
}

/**
 * Converte chaves de objeto para snake_case
 * @param obj - Objeto a ser convertido
 * @returns Objeto com chaves em snake_case
 */
export function snakeCaseKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeCaseKeys(item));
  }

  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      const value = obj[key];

      if (typeof value === 'object' && value !== null) {
        result[snakeKey] = snakeCaseKeys(value as Record<string, unknown>);
      } else {
        result[snakeKey] = value;
      }
    }
  }

  return result;
}
