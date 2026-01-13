/**
 * Formats a date according to the specified format pattern.
 * @param date - The date to format (Date object, timestamp, or ISO string)
 * @param format - Format pattern (e.g., 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY HH:mm:ss')
 * @returns Formatted date string
 * @example
 * formatDate(new Date('2024-01-15'), 'DD/MM/YYYY') // '15/01/2024'
 * formatDate('2024-01-15T10:30:00', 'DD/MM/YYYY HH:mm') // '15/01/2024 10:30'
 */
export function formatDate(date: Date | string | number, format: string = 'DD/MM/YYYY'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }

  const pad = (num: number): string => num.toString().padStart(2, '0');

  const replacements: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    YY: d.getFullYear().toString().slice(-2),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };

  return format.replace(/YYYY|YY|MM|DD|HH|mm|ss/g, (match) => replacements[match]);
}

/**
 * Formats a currency value in Brazilian Real (BRL) format.
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56) // 'R$ 1.234,56'
 * formatCurrency(1000, { showSymbol: false }) // '1.000,00'
 */
export function formatCurrency(
  value: number,
  options: { showSymbol?: boolean; decimals?: number } = {}
): string {
  const { showSymbol = true, decimals = 2 } = options;

  const formatted = value.toFixed(decimals).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return showSymbol ? `R$ ${formatted}` : formatted;
}

/**
 * Formats a Brazilian phone number.
 * @param phone - The phone number (digits only or with formatting)
 * @returns Formatted phone number string
 * @example
 * formatPhone('11987654321') // '(11) 98765-4321'
 * formatPhone('1133334444') // '(11) 3333-4444'
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11) {
    // Mobile: (11) 98765-4321
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    // Landline: (11) 3333-4444
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone; // Return original if invalid length
}

/**
 * Formats a Brazilian CPF (Cadastro de Pessoas Físicas).
 * @param cpf - The CPF (digits only or with formatting)
 * @returns Formatted CPF string
 * @example
 * formatCPF('12345678901') // '123.456.789-01'
 */
export function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11) {
    return cpf; // Return original if invalid length
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Formats a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica).
 * @param cnpj - The CNPJ (digits only or with formatting)
 * @returns Formatted CNPJ string
 * @example
 * formatCNPJ('12345678000195') // '12.345.678/0001-95'
 */
export function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '');

  if (digits.length !== 14) {
    return cnpj; // Return original if invalid length
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(
    8,
    12
  )}-${digits.slice(12)}`;
}
