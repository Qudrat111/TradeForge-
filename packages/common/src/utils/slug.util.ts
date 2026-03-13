/**
 * Slug utility functions for the TradeForge platform.
 */

/** Regex for a valid URL slug: lowercase alphanumeric and hyphens, no leading/trailing hyphens. */
const VALID_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Converts arbitrary text into a URL-friendly slug.
 * Handles Unicode characters by normalising to NFD and stripping diacritics.
 * @param text The source text.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // keep alphanumeric, spaces, hyphens
    .replace(/[\s_]+/g, '-') // spaces/underscores → hyphen
    .replace(/-+/g, '-') // collapse repeated hyphens
    .replace(/^-+|-+$/g, ''); // strip leading/trailing hyphens
}

/**
 * Alias for slugify – generates a URL slug from the provided text.
 */
export function generateSlug(text: string): string {
  return slugify(text);
}

/**
 * Returns true if the given string is a valid URL slug.
 * Valid slugs are lowercase, contain only alphanumeric characters and hyphens,
 * and do not start or end with a hyphen.
 */
export function isValidSlug(slug: string): boolean {
  return VALID_SLUG_RE.test(slug);
}
