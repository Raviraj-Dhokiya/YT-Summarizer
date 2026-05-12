/**
 * Formats a date string/object to a readable locale string.
 * @param {string|Date} dateInput
 * @param {string} locale - Default: 'en-IN'
 * @returns {string} e.g. "12 May 2026"
 */
export function formatDate(dateInput, locale = 'en-IN') {
  return new Date(dateInput).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats a date string/object to a short date (no year).
 * @param {string|Date} dateInput
 * @param {string} locale - Default: 'en-IN'
 * @returns {string} e.g. "12 May"
 */
export function formatShortDate(dateInput, locale = 'en-IN') {
  return new Date(dateInput).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Validates whether a string is a YouTube URL.
 * @param {string} url
 * @returns {boolean}
 */
export function isValidYouTubeUrl(url) {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/.test(url);
}

/**
 * Generates the YouTube thumbnail URL for a given video ID.
 * @param {string} videoId
 * @param {'default'|'mqdefault'|'hqdefault'|'maxresdefault'} quality
 * @returns {string}
 */
export function getThumbnailUrl(videoId, quality = 'mqdefault') {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
