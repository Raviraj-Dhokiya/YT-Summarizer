import { useState } from 'react';
import { EXAMPLE_URLS, SUPPORTED_URL_FORMATS, APP_NAME, APP_TAGLINE } from '../constants';
import { isValidYouTubeUrl } from '../utils/helpers';

const LANGUAGES = [
  { code: 'English', label: '🇬🇧 English' },
  { code: 'Hindi', label: '🇮🇳 Hindi (हिंदी)' },
  { code: 'Gujarati', label: '🇮🇳 Gujarati (ગુજરાતી)' },
  { code: 'Spanish', label: '🇪🇸 Spanish' },
  { code: 'French', label: '🇫🇷 French' },
  { code: 'German', label: '🇩🇪 German' },
  { code: 'Japanese', label: '🇯🇵 Japanese' },
  { code: 'Korean', label: '🇰🇷 Korean' },
  { code: 'Portuguese', label: '🇧🇷 Portuguese' },
  { code: 'Arabic', label: '🇸🇦 Arabic' },
  { code: 'Chinese', label: '🇨🇳 Chinese' },
];

const YouTubeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="#FF0000"/>
    <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5Z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export default function URLInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed) onSubmit(trimmed, language);
  };

  return (
    <div className="
      bg-white dark:bg-[#1a1a1a]
      border border-[#e0e0e0] dark:border-[#2e2e2e]
      rounded-xl p-7 animate-fade-up
    ">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="
          w-11 h-11 bg-blue-100 dark:bg-blue-950/30
          rounded-lg flex items-center justify-center flex-shrink-0
        ">
          <YouTubeIcon />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold text-[#111] dark:text-[#f0f0f0]">
            {APP_NAME}
          </h1>
          <p className="text-[13px] text-[#555] dark:text-[#909090] mt-0.5">
            {APP_TAGLINE}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* URL + Submit row */}
        <div className="flex gap-2.5 items-center">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] dark:text-[#555] flex pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </span>

            <input
              id="youtube-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              disabled={loading}
              className="
                w-full py-[11px] pl-10 pr-10
                bg-[#f0f0f0] dark:bg-[#242424]
                border border-[#e0e0e0] dark:border-[#2e2e2e]
                rounded-lg text-[#111] dark:text-[#f0f0f0]
                text-sm font-sans outline-none
                placeholder-[#999] dark:placeholder-[#555]
                transition-all duration-150
                focus:border-[#2563eb] dark:focus:border-[#60a5fa]
                focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />

            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="
                  absolute right-2.5 top-1/2 -translate-y-1/2
                  bg-none border-none text-[#999] dark:text-[#555]
                  cursor-pointer flex p-1 rounded
                  hover:text-[#111] dark:hover:text-[#f0f0f0]
                "
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          <button
            id="summarize-btn"
            type="submit"
            disabled={loading || !url.trim() || !isValidYouTubeUrl(url.trim())}
            className="
              inline-flex items-center gap-1.5 px-[18px] py-[9px]
              bg-[#2563eb] dark:bg-[#60a5fa]
              text-white text-sm font-medium font-sans
              rounded-lg cursor-pointer whitespace-nowrap
              transition-all duration-150
              hover:opacity-85
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <span className="
                  w-3.5 h-3.5 inline-block rounded-full
                  border-2 border-white/30 border-t-white
                  animate-spin-fast
                " />
                Analyzing...
              </>
            ) : (
              <>
                <SparkleIcon />
                Summarize
              </>
            )}
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[#999] dark:text-[#555]">
            <GlobeIcon />
            <span className="text-xs">Summary Language:</span>
          </div>
          <div className="relative">
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
              className="
                appearance-none
                bg-[#f0f0f0] dark:bg-[#242424]
                border border-[#e0e0e0] dark:border-[#2e2e2e]
                text-[#111] dark:text-[#f0f0f0]
                text-[12px] font-sans
                pl-2.5 pr-7 py-1.5
                rounded-md outline-none cursor-pointer
                transition-all duration-150
                hover:border-[#d0d0d0] dark:hover:border-[#3a3a3a]
                focus:border-[#2563eb] dark:focus:border-[#60a5fa]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#999] dark:text-[#555]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
          {language !== 'English' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#2563eb]/10 text-[#2563eb] dark:bg-[#60a5fa]/10 dark:text-[#60a5fa] font-medium">
              {language} ✓
            </span>
          )}
        </div>
      </form>

      {/* Hints */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs text-[#999] dark:text-[#555]">Supports:</span>
        {EXAMPLE_URLS.map((ex, i) => (
          <button
            key={i}
            onClick={() => setUrl(ex)}
            className="
              bg-transparent
              border border-[#e0e0e0] dark:border-[#2e2e2e]
              text-[#999] dark:text-[#555]
              text-[11px] font-mono
              px-2 py-0.5 rounded cursor-pointer
              transition-all duration-150
              hover:border-[#d0d0d0] dark:hover:border-[#3a3a3a]
              hover:text-[#555] dark:hover:text-[#909090]
            "
          >
            {SUPPORTED_URL_FORMATS[i]}...
          </button>
        ))}
      </div>
    </div>
  );
}
