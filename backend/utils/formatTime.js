/**
 * Formats seconds into MM:SS string format.
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time e.g. "3:05"
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
