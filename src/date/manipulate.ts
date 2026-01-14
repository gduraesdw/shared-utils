/**
 * Utilitários de manipulação de data e tempo
 */

/**
 * Adiciona dias a uma data
 * @param date - Data base
 * @param days - Número de dias a adicionar
 * @returns Nova data
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Adiciona meses a uma data
 * @param date - Data base
 * @param months - Número de meses a adicionar
 * @returns Nova data
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Adiciona anos a uma data
 * @param date - Data base
 * @param years - Número de anos a adicionar
 * @returns Nova data
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Adiciona horas a uma data
 * @param date - Data base
 * @param hours - Número de horas a adicionar
 * @returns Nova data
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Adiciona minutos a uma data
 * @param date - Data base
 * @param minutes - Número de minutos a adicionar
 * @returns Nova data
 */
export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}

/**
 * Subtrai dias de uma data
 * @param date - Data base
 * @param days - Número de dias a subtrair
 * @returns Nova data
 */
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param date1 - Primeira data
 * @param date2 - Segunda data
 * @returns Diferença em dias
 */
export function diffInDays(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / msPerDay);
}

/**
 * Calcula a diferença em horas entre duas datas
 * @param date1 - Primeira data
 * @param date2 - Segunda data
 * @returns Diferença em horas
 */
export function diffInHours(date1: Date, date2: Date): number {
  const msPerHour = 1000 * 60 * 60;
  return Math.floor((date2.getTime() - date1.getTime()) / msPerHour);
}

/**
 * Calcula a diferença em minutos entre duas datas
 * @param date1 - Primeira data
 * @param date2 - Segunda data
 * @returns Diferença em minutos
 */
export function diffInMinutes(date1: Date, date2: Date): number {
  const msPerMinute = 1000 * 60;
  return Math.floor((date2.getTime() - date1.getTime()) / msPerMinute);
}

/**
 * Calcula a diferença em segundos entre duas datas
 * @param date1 - Primeira data
 * @param date2 - Segunda data
 * @returns Diferença em segundos
 */
export function diffInSeconds(date1: Date, date2: Date): number {
  const msPerSecond = 1000;
  return Math.floor((date2.getTime() - date1.getTime()) / msPerSecond);
}

/**
 * Retorna o início do dia para uma data
 * @param date - Data
 * @returns Data no início do dia (00:00:00)
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Retorna o fim do dia para uma data
 * @param date - Data
 * @returns Data no fim do dia (23:59:59)
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Retorna o início do mês para uma data
 * @param date - Data
 * @returns Data no início do mês
 */
export function startOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Retorna o fim do mês para uma data
 * @param date - Data
 * @returns Data no fim do mês
 */
export function endOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Verifica se uma data é hoje
 * @param date - Data a verificar
 * @returns true se a data for hoje
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Verifica se uma data é passada
 * @param date - Data a verificar
 * @returns true se a data for passada
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Verifica se uma data é futura
 * @param date - Data a verificar
 * @returns true se a data for futura
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Verifica se uma data está entre duas datas
 * @param date - Data a verificar
 * @param start - Data inicial
 * @param end - Data final
 * @returns true se a data estiver entre as datas
 */
export function isBetween(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * Verifica se uma data é fim de semana
 * @param date - Data a verificar
 * @returns true se for fim de semana
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Calcula a idade a partir de uma data de nascimento
 * @param birthDate - Data de nascimento
 * @returns Idade em anos
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Retorna o número de dias no mês
 * @param date - Data
 * @returns Número de dias no mês
 */
export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * Verifica se um ano é bissexto
 * @param year - Ano
 * @returns true se for bissexto
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
