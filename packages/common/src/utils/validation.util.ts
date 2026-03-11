/**
 * Validation utility functions for the TradeForge platform.
 */

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const URL_RE =
  /^(https?):\/\/(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/;

/**
 * HS Code: 6–10 digit numeric string, sometimes written with dots (e.g., 8471.30).
 * We validate the numeric content (6–10 digits after stripping dots).
 */
const HS_CODE_RE = /^[0-9]{6,10}$|^[0-9]{4}\.[0-9]{2,6}$/;

/** Returns true if the given string is a valid RFC 5321 email address. */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

/** Returns true if the given string is a valid UUID (versions 1–5). */
export function isValidUUID(str: string): boolean {
  return UUID_RE.test(str);
}

/** Returns true if the given string is a valid absolute HTTP/HTTPS URL. */
export function isValidURL(url: string): boolean {
  return URL_RE.test(url.trim());
}

/**
 * Returns true if the given string is a valid HS (Harmonized System) tariff code.
 * Accepts 6–10 digit numeric codes, optionally formatted with dots (e.g., '8471.30').
 */
export function isValidHsCode(code: string): boolean {
  return HS_CODE_RE.test(code.trim());
}

/**
 * Sanitises a user-supplied input string by:
 * - Trimming whitespace
 * - Removing null bytes
 * - Escaping HTML special characters to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\0/g, '') // remove null bytes
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Country-specific tax ID validation patterns.
 * Each entry maps a two-letter ISO 3166-1 alpha-2 country code to a regex.
 */
const TAX_ID_PATTERNS: Record<string, RegExp> = {
  US: /^\d{2}-?\d{7}$/, // EIN: XX-XXXXXXX
  GB: /^\d{3}\s?\d{8}$/, // VAT: XXX XXXXXXXX
  DE: /^DE\d{9}$/, // VAT: DExxxxxxxxx
  FR: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/, // VAT: FRXX XXXXXXXXX
  AU: /^\d{11}$/, // ABN: 11 digits
  CA: /^\d{9}(RT\d{4})?$/, // BN: 9 digits + optional RT
  IN: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, // GSTIN
  CN: /^[0-9A-HJ-NP-RT-UW-Y]{18}$/, // Unified Social Credit Code (18 chars)
  JP: /^\d{13}$/, // My Number: 13 digits
  SG: /^\d{9}[A-Z]$/, // UEN: 9 digits + letter
  AE: /^\d{15}$/, // TRN: 15 digits
  SA: /^\d{15}$/, // VAT: 15 digits
  BR: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, // CNPJ
  MX: /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/, // RFC
  ZA: /^\d{10}$/, // TIN: 10 digits
};

/**
 * Validates a tax ID for a given country code.
 * Returns true if a pattern exists for the country and the ID matches it,
 * or if no country-specific pattern is defined (permissive fallback).
 * @param taxId       The tax identifier string.
 * @param countryCode ISO 3166-1 alpha-2 country code (e.g., 'US', 'DE').
 */
export function isValidTaxId(taxId: string, countryCode: string): boolean {
  const pattern = TAX_ID_PATTERNS[countryCode.toUpperCase()];
  if (!pattern) {
    // No pattern defined for this country – apply minimal length check only
    return taxId.trim().length >= 5;
  }
  return pattern.test(taxId.trim());
}
