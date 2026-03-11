/**
 * Date utility functions for the TradeForge platform.
 * All operations treat dates consistently and avoid mutation.
 */

const DATE_FORMAT_TOKENS: Record<string, (d: Date) => string> = {
  YYYY: (d) => String(d.getUTCFullYear()),
  MM: (d) => String(d.getUTCMonth() + 1).padStart(2, '0'),
  DD: (d) => String(d.getUTCDate()).padStart(2, '0'),
  HH: (d) => String(d.getUTCHours()).padStart(2, '0'),
  mm: (d) => String(d.getUTCMinutes()).padStart(2, '0'),
  ss: (d) => String(d.getUTCSeconds()).padStart(2, '0'),
};

/**
 * Formats a Date object using a simple token-based format string.
 * Supported tokens: YYYY, MM, DD, HH, mm, ss
 * Example: formatDate(date, 'YYYY-MM-DD') => '2024-01-15'
 */
export function formatDate(date: Date, format: string): string {
  let result = format;
  for (const [token, fn] of Object.entries(DATE_FORMAT_TOKENS)) {
    result = result.replace(token, fn(date));
  }
  return result;
}

/**
 * Parses an ISO 8601 date string or common date strings into a Date object.
 * Throws if the string cannot be parsed into a valid date.
 */
export function parseDate(str: string): Date {
  const date = new Date(str);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: "${str}"`);
  }
  return date;
}

/**
 * Returns true if the given date is in the past (before current UTC time).
 */
export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Returns a new Date with the specified number of days added (or subtracted if negative).
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Returns the number of whole days between two dates (a - b).
 * Positive if a is after b, negative if a is before b.
 */
export function diffInDays(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.trunc((a.getTime() - b.getTime()) / msPerDay);
}

/**
 * Returns a new Date representing the same instant expressed as a UTC Date object.
 * The returned object is identical in value but documents intent clearly.
 */
export function toUtc(date: Date): Date {
  return new Date(date.getTime());
}

/**
 * Parses a UTC ISO 8601 string and returns a Date object in local time representation.
 * Throws if the string is not a valid date.
 */
export function fromUtc(str: string): Date {
  return parseDate(str);
}
