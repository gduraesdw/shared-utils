/**
 * Utilitários de sanitização e segurança
 */

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param str - String a ser escapada
 * @returns String com caracteres HTML escapados
 */
export function escapeHTML(str: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Remove tags HTML de uma string
 * @param str - String com HTML
 * @returns String sem tags HTML
 */
export function stripHTML(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitiza uma string removendo caracteres perigosos
 * @param str - String a ser sanitizada
 * @returns String sanitizada
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Sanitiza entrada SQL básica (use prepared statements em produção)
 * @param str - String a ser sanitizada
 * @returns String sanitizada
 */
export function sanitizeSQL(str: string): string {
  return str
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * Valida e sanitiza URL
 * @param url - URL a ser sanitizada
 * @param allowedProtocols - Protocolos permitidos
 * @returns URL sanitizada ou null se inválida
 */
export function sanitizeURL(url: string, allowedProtocols = ['http', 'https']): string | null {
  try {
    const parsed = new URL(url);

    if (!allowedProtocols.includes(parsed.protocol.replace(':', ''))) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Remove scripts de uma string
 * @param str - String com possíveis scripts
 * @returns String sem scripts
 */
export function removeScripts(str: string): string {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

/**
 * Sanitiza nome de arquivo
 * @param filename - Nome do arquivo
 * @returns Nome de arquivo sanitizado
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '')
    .substring(0, 255);
}

/**
 * Valida e sanitiza email
 * @param email - Email a ser sanitizado
 * @returns Email sanitizado ou null se inválido
 */
export function sanitizeEmail(email: string): string | null {
  const sanitized = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Remove espaços em branco excessivos
 * @param str - String a ser limpa
 * @returns String sem espaços excessivos
 */
export function removeExcessiveWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Sanitiza entrada de JSON
 * @param str - String JSON
 * @returns Objeto parseado ou null se inválido
 */
export function sanitizeJSON(str: string): unknown | null {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Valida e sanitiza número
 * @param value - Valor a ser sanitizado
 * @param options - Opções de validação
 * @returns Número sanitizado ou null se inválido
 */
export function sanitizeNumber(
  value: string | number,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): number | null {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (options.integer && !Number.isInteger(num)) {
    return null;
  }

  if (options.min !== undefined && num < options.min) {
    return null;
  }

  if (options.max !== undefined && num > options.max) {
    return null;
  }

  return num;
}

/**
 * Mascara dados sensíveis em logs
 * @param data - Objeto com dados
 * @param sensitiveKeys - Chaves consideradas sensíveis
 * @returns Objeto com dados sensíveis mascarados
 */
export function maskSensitiveData(
  data: Record<string, unknown>,
  sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'creditCard']
): Record<string, unknown> {
  const masked = { ...data };

  for (const key in masked) {
    if (
      sensitiveKeys.some((sensitiveKey) => key.toLowerCase().includes(sensitiveKey.toLowerCase()))
    ) {
      masked[key] = '***MASKED***';
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key] as Record<string, unknown>, sensitiveKeys);
    }
  }

  return masked;
}

/**
 * Previne path traversal attacks
 * @param path - Caminho a ser validado
 * @param baseDir - Diretório base permitido
 * @returns Caminho seguro ou null se inválido
 */
export function sanitizePath(path: string, baseDir = ''): string | null {
  const normalized = path.replace(/\\/g, '/').replace(/\.{2,}/g, '.');

  if (normalized.includes('../') || normalized.includes('..\\')) {
    return null;
  }

  if (baseDir && !normalized.startsWith(baseDir)) {
    return null;
  }

  return normalized;
}
