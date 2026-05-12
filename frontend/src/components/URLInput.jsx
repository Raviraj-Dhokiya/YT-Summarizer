import { useState } from 'react';
import styles from './URLInput.module.css';
import { EXAMPLE_URLS, SUPPORTED_URL_FORMATS, APP_NAME, APP_TAGLINE } from '../constants';
import { isValidYouTubeUrl } from '../utils/helpers';

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

export default function URLInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <YouTubeIcon />
        </div>
        <div>
          <h1 className={styles.title}>{APP_NAME}</h1>
          <p className={styles.subtitle}>{APP_TAGLINE}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrap}>
          <span className={styles.inputIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className={styles.input}
            disabled={loading}
          />
          {url && (
            <button type="button" className={styles.clearBtn} onClick={() => setUrl('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !url.trim() || !isValidYouTubeUrl(url.trim())}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
              Analyzing...
            </>
          ) : (
            <>
              <SparkleIcon />
              Summarize
            </>
          )}
        </button>
      </form>

      <div className={styles.hints}>
        <span className={styles.hintsLabel}>Supports:</span>
        {EXAMPLE_URLS.map((ex, i) => (
          <button key={i} className={styles.hint} onClick={() => setUrl(ex)}>
            {SUPPORTED_URL_FORMATS[i]}...
          </button>
        ))}
      </div>
    </div>
  );
}
