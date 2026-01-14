/**
 * Utilitários de máscara para strings
 */

/**
 * Aplica máscara genérica a uma string
 * @param value - Valor a ser mascarado
 * @param pattern - Padrão da máscara (# representa dígito)
 * @returns String mascarada
 */
export function applyMask(value: string, pattern: string): string {
  const numbers = value.replace(/\D/g, '');
  let index = 0;
  let result = '';

  for (const char of pattern) {
    if (index >= numbers.length) break;

    if (char === '#') {
      result += numbers[index];
      index++;
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Remove máscara de uma string
 * @param value - String mascarada
 * @returns String sem máscara (apenas números)
 */
export function removeMask(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Máscara de CPF
 * @param value - CPF sem máscara
 * @returns CPF mascarado
 */
export function maskCPF(value: string): string {
  return applyMask(value, '###.###.###-##');
}

/**
 * Máscara de CNPJ
 * @param value - CNPJ sem máscara
 * @returns CNPJ mascarado
 */
export function maskCNPJ(value: string): string {
  return applyMask(value, '##.###.###/####-##');
}

/**
 * Máscara de telefone
 * @param value - Telefone sem máscara
 * @returns Telefone mascarado
 */
export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return applyMask(value, '(##) ####-####');
  }
  return applyMask(value, '(##) #####-####');
}

/**
 * Máscara de CEP
 * @param value - CEP sem máscara
 * @returns CEP mascarado
 */
export function maskCEP(value: string): string {
  return applyMask(value, '#####-###');
}

/**
 * Máscara de cartão de crédito
 * @param value - Número do cartão sem máscara
 * @returns Número mascarado
 */
export function maskCreditCard(value: string): string {
  return applyMask(value, '#### #### #### ####');
}

/**
 * Máscara de data (DD/MM/YYYY)
 * @param value - Data sem máscara
 * @returns Data mascarada
 */
export function maskDate(value: string): string {
  return applyMask(value, '##/##/####');
}

/**
 * Máscara de hora (HH:MM)
 * @param value - Hora sem máscara
 * @returns Hora mascarada
 */
export function maskTime(value: string): string {
  return applyMask(value, '##:##');
}

/**
 * Máscara de moeda
 * @param value - Valor numérico
 * @param locale - Locale (padrão: pt-BR)
 * @param currency - Moeda (padrão: BRL)
 * @returns Valor formatado
 */
export function maskCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Mascara dados sensíveis mantendo apenas primeiros e últimos caracteres
 * @param value - Valor a ser mascarado
 * @param visibleStart - Quantidade de caracteres visíveis no início
 * @param visibleEnd - Quantidade de caracteres visíveis no fim
 * @param maskChar - Caractere para mascarar (padrão: *)
 * @returns String mascarada
 */
export function maskSensitiveData(
  value: string,
  visibleStart = 4,
  visibleEnd = 4,
  maskChar = '*'
): string {
  if (value.length <= visibleStart + visibleEnd) {
    return maskChar.repeat(value.length);
  }

  const start = value.slice(0, visibleStart);
  const end = value.slice(-visibleEnd);
  const middle = maskChar.repeat(value.length - visibleStart - visibleEnd);

  return start + middle + end;
}

/**
 * Mascara email mantendo apenas primeira letra e domínio
 * @param email - Email a ser mascarado
 * @returns Email mascarado
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;

  const maskedLocal =
    localPart.length > 2
      ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
      : '*'.repeat(localPart.length);

  return `${maskedLocal}@${domain}`;
}
