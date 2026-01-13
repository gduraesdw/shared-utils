/**
 * Validates an email address.
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid.email') // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas).
 * @param cpf - The CPF to validate (with or without formatting)
 * @returns True if the CPF is valid, false otherwise
 * @example
 * isValidCPF('123.456.789-01') // Validates based on algorithm
 * isValidCPF('12345678901') // Validates based on algorithm
 */
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11) {
    return false;
  }

  // Check for known invalid CPFs (all same digits)
  if (/^(\d)\1+$/.test(digits)) {
    return false;
  }

  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(digits.charAt(9))) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== parseInt(digits.charAt(10))) {
    return false;
  }

  return true;
}

/**
 * Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica).
 * @param cnpj - The CNPJ to validate (with or without formatting)
 * @returns True if the CNPJ is valid, false otherwise
 * @example
 * isValidCNPJ('12.345.678/0001-95') // Validates based on algorithm
 * isValidCNPJ('12345678000195') // Validates based on algorithm
 */
export function isValidCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');

  if (digits.length !== 14) {
    return false;
  }

  // Check for known invalid CNPJs (all same digits)
  if (/^(\d)\1+$/.test(digits)) {
    return false;
  }

  // Validate first check digit
  let sum = 0;
  let pos = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  let checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (checkDigit !== parseInt(digits.charAt(12))) {
    return false;
  }

  // Validate second check digit
  sum = 0;
  pos = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (checkDigit !== parseInt(digits.charAt(13))) {
    return false;
  }

  return true;
}

/**
 * Validates a Brazilian phone number.
 * @param phone - The phone number to validate (with or without formatting)
 * @returns True if the phone number is valid, false otherwise
 * @example
 * isValidPhone('(11) 98765-4321') // true (mobile)
 * isValidPhone('1133334444') // true (landline)
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  // Valid: 10 digits (landline) or 11 digits (mobile with 9)
  return digits.length === 10 || digits.length === 11;
}

/**
 * Validates a credit card number using the Luhn algorithm.
 * @param cardNumber - The credit card number to validate (with or without spaces/dashes)
 * @returns True if the credit card number is valid, false otherwise
 * @example
 * isValidCreditCard('4532015112830366') // true (if valid by Luhn)
 * isValidCreditCard('1234-5678-9012-3456') // false
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}
