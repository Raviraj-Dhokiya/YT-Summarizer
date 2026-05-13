// API base URL (uses Vite proxy in dev, full URL in production)
export const API_BASE_URL = '/api';

// App display name
export const APP_NAME = 'YT Summarizer';
export const APP_TAGLINE = 'Paste any YouTube URL — get AI-powered insights instantly';

// History max items (same as backend limit)
export const HISTORY_LIMIT = 20;

// Video result tab names
export const VIDEO_TABS = ['Summary', 'Key Points', 'Timestamps'];

// Example URLs shown in the URL input
export const EXAMPLE_URLS = [
  'https://www.youtube.com/watch?v=Zi_XLOBDo_Y',
  'https://youtu.be/Zi_XLOBDo_Y',
];

// Supported YouTube URL patterns (for display/hints only)
export const SUPPORTED_URL_FORMATS = ['youtube.com/watch?v=', 'youtu.be/'];
