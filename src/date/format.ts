/**
 * Utilitários de formatação de data e tempo
 */

/**
 * Formata uma data
 * @param date - Data a ser formatada
 * @param format - Formato ('short' | 'long' | 'full')
 * @param locale - Locale (padrão: pt-BR)
 * @returns Data formatada
 */
export function formatDate(
  date: Date,
  format: 'short' | 'long' | 'full' = 'short',
  locale = 'pt-BR'
): string {
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { dateStyle: 'short' }
      : format === 'long'
      ? { dateStyle: 'long' }
      : { dateStyle: 'full' };

  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formata uma hora
 * @param date - Data a ser formatada
 * @param includeSeconds - Incluir segundos
 * @param locale - Locale (padrão: pt-BR)
 * @returns Hora formatada
 */
export function formatTime(date: Date, includeSeconds = false, locale = 'pt-BR'): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formata data e hora
 * @param date - Data a ser formatada
 * @param format - Formato
 * @param locale - Locale (padrão: pt-BR)
 * @returns Data e hora formatadas
 */
export function formatDateTime(
  date: Date,
  format: 'short' | 'long' | 'full' = 'short',
  locale = 'pt-BR'
): string {
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { dateStyle: 'short', timeStyle: 'short' }
      : format === 'long'
      ? { dateStyle: 'long', timeStyle: 'medium' }
      : { dateStyle: 'full', timeStyle: 'long' };

  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formata data para padrão ISO (YYYY-MM-DD)
 * @param date - Data
 * @returns Data no formato ISO
 */
export function formatISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formata data para padrão brasileiro (DD/MM/YYYY)
 * @param date - Data
 * @returns Data no formato brasileiro
 */
export function formatBrazilianDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formata data de forma relativa (há X dias, daqui a X dias)
 * @param date - Data
 * @param locale - Locale (padrão: pt-BR)
 * @returns Data formatada de forma relativa
 */
export function formatRelative(date: Date, locale = 'pt-BR'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  const intervals = [
    { seconds: 31536000, label: 'ano' },
    { seconds: 2592000, label: 'mês' },
    { seconds: 86400, label: 'dia' },
    { seconds: 3600, label: 'hora' },
    { seconds: 60, label: 'minuto' },
    { seconds: 1, label: 'segundo' },
  ];

  for (const interval of intervals) {
    const count = Math.floor(absSeconds / interval.seconds);
    if (count >= 1) {
      const plural = count > 1 ? 's' : '';
      const prefix = diffInSeconds < 0 ? 'há' : 'em';
      return `${prefix} ${count} ${interval.label}${plural}`;
    }
  }

  return 'agora';
}

/**
 * Parse de string de data em formato brasileiro
 * @param dateString - String de data (DD/MM/YYYY)
 * @returns Objeto Date
 */
export function parseBrazilianDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Parse de string de data em formato ISO
 * @param dateString - String de data (YYYY-MM-DD)
 * @returns Objeto Date
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Formata timestamp Unix
 * @param timestamp - Timestamp Unix (segundos)
 * @param format - Formato de saída
 * @param locale - Locale
 * @returns Data formatada
 */
export function formatUnixTimestamp(
  timestamp: number,
  format: 'short' | 'long' | 'full' = 'short',
  locale = 'pt-BR'
): string {
  const date = new Date(timestamp * 1000);
  return formatDateTime(date, format, locale);
}

/**
 * Converte data para timestamp Unix
 * @param date - Data
 * @returns Timestamp Unix (segundos)
 */
export function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Formata duração em milissegundos
 * @param ms - Duração em milissegundos
 * @returns String formatada (ex: "2h 30m 15s")
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

  return parts.join(' ') || '0s';
}
