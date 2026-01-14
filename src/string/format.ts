/**
 * Utilitários de formatação de strings
 */

/**
 * Formata um número como moeda brasileira
 * @param value - Valor numérico
 * @param options - Opções de formatação
 * @returns String formatada como moeda
 */
export function formatCurrency(
  value: number,
  options: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    locale = 'pt-BR',
    currency = 'BRL',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formata um CPF
 * @param cpf - CPF sem formatação
 * @returns CPF formatado (XXX.XXX.XXX-XX)
 */
export function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) {
    throw new Error('CPF deve conter 11 dígitos');
  }
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CNPJ
 * @param cnpj - CNPJ sem formatação
 * @returns CNPJ formatado (XX.XXX.XXX/XXXX-XX)
 */
export function formatCNPJ(cnpj: string): string {
  const numbers = cnpj.replace(/\D/g, '');
  if (numbers.length !== 14) {
    throw new Error('CNPJ deve conter 14 dígitos');
  }
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata um telefone brasileiro
 * @param phone - Telefone sem formatação
 * @returns Telefone formatado
 */
export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '');

  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  throw new Error('Telefone deve conter 10 ou 11 dígitos');
}

/**
 * Formata um CEP
 * @param cep - CEP sem formatação
 * @returns CEP formatado (XXXXX-XXX)
 */
export function formatCEP(cep: string): string {
  const numbers = cep.replace(/\D/g, '');
  if (numbers.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos');
  }
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Trunca uma string com reticências
 * @param str - String a ser truncada
 * @param maxLength - Comprimento máximo
 * @param suffix - Sufixo para indicar truncamento (padrão: '...')
 * @returns String truncada
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitaliza a primeira letra de uma string
 * @param str - String a ser capitalizada
 * @returns String com primeira letra maiúscula
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitaliza a primeira letra de cada palavra
 * @param str - String a ser capitalizada
 * @returns String com cada palavra capitalizada
 */
export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Converte string para camelCase
 * @param str - String a ser convertida
 * @returns String em camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toLowerCase());
}

/**
 * Converte string para PascalCase
 * @param str - String a ser convertida
 * @returns String em PascalCase
 */
export function toPascalCase(str: string): string {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * Converte string para snake_case
 * @param str - String a ser convertida
 * @returns String em snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Converte string para kebab-case
 * @param str - String a ser convertida
 * @returns String em kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Gera um slug a partir de uma string
 * @param str - String a ser convertida
 * @returns Slug
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Adiciona padding à esquerda de uma string
 * @param str - String original
 * @param length - Comprimento final desejado
 * @param char - Caractere para padding (padrão: ' ')
 * @returns String com padding
 */
export function padLeft(str: string, length: number, char = ' '): string {
  return str.padStart(length, char);
}

/**
 * Adiciona padding à direita de uma string
 * @param str - String original
 * @param length - Comprimento final desejado
 * @param char - Caractere para padding (padrão: ' ')
 * @returns String com padding
 */
export function padRight(str: string, length: number, char = ' '): string {
  return str.padEnd(length, char);
}
