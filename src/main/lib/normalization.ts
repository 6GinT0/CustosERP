/**
 * Normalizes text by removing diacritics, converting to lowercase, and trimming.
 * Useful for creating slugs or search-friendly text.
 */
export function normalizeText(text: string): string {
  if (!text) return ''
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
