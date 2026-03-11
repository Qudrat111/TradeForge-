/**
 * Currency utility functions for the TradeForge platform.
 * Follows ISO 4217 conventions for rounding and formatting.
 */

/** Map of currencies that use zero decimal places. */
const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW', 'VND', 'IDR', 'BIF', 'CLP', 'GNF', 'ISK', 'KMF', 'MGA', 'PYG', 'RWF', 'UGX', 'XAF', 'XOF', 'XPF']);

/** Map of currencies that use three decimal places. */
const THREE_DECIMAL_CURRENCIES = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND']);

/**
 * Returns the number of decimal places used by a given ISO 4217 currency code.
 */
export function getCurrencyDecimals(currency: string): number {
  const code = currency.toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(code)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(code)) return 3;
  return 2;
}

/**
 * Formats an amount as a localized currency string.
 * @param amount   The numeric amount to format.
 * @param currency ISO 4217 currency code (e.g., 'USD').
 * @param locale   BCP 47 locale string (default: 'en-US').
 */
export function formatCurrency(amount: number, currency: string, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: getCurrencyDecimals(currency),
    maximumFractionDigits: getCurrencyDecimals(currency),
  }).format(amount);
}

/**
 * Converts an amount from one currency to another using a rates map.
 * @param amount       The amount to convert.
 * @param fromCurrency Source ISO 4217 currency code.
 * @param toCurrency   Target ISO 4217 currency code.
 * @param rates        A map of currency code -> exchange rate relative to a common base.
 *                     Example: { USD: 1, EUR: 0.92, GBP: 0.79 }
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) return amount;

  const fromRate = rates[from];
  const toRate = rates[to];

  if (fromRate === undefined) {
    throw new Error(`Exchange rate not found for currency: ${from}`);
  }
  if (toRate === undefined) {
    throw new Error(`Exchange rate not found for currency: ${to}`);
  }

  const amountInBase = amount / fromRate;
  const converted = amountInBase * toRate;
  return roundCurrency(converted, to);
}

/**
 * Rounds an amount to the correct number of decimal places for the given currency.
 * @param amount   The amount to round.
 * @param currency ISO 4217 currency code.
 */
export function roundCurrency(amount: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  const factor = Math.pow(10, decimals);
  return Math.round(amount * factor) / factor;
}

/**
 * Parses a currency string (e.g., '$1,234.56' or '1.234,56') into a numeric value.
 * Strips all characters that are not digits, dots, commas, or leading minus signs,
 * then normalises the decimal separator.
 * @param str The formatted currency string to parse.
 */
export function parseCurrency(str: string): number {
  const cleaned = str.trim();

  // Detect European format: last separator is a comma (e.g., '1.234,56')
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  let normalised: string;
  if (lastComma > lastDot) {
    // European format – remove dots used as thousands separators, replace comma with dot
    normalised = cleaned.replace(/[^0-9,\-]/g, '').replace(',', '.');
  } else {
    // US/standard format – remove commas used as thousands separators
    normalised = cleaned.replace(/[^0-9.\-]/g, '');
  }

  const value = parseFloat(normalised);
  if (isNaN(value)) {
    throw new Error(`Unable to parse currency string: "${str}"`);
  }
  return value;
}
