import { useEffect } from 'react';
import URLInput from './components/URLInput';
import VideoResult from './components/VideoResult';
import History from './components/History';
import { useVideo } from './hooks/useVideo';
import { useTheme } from './hooks/useTheme';
import styles from './App.module.css';
import './index.css';

export default function App() {
  const {
    currentVideo,
    loading,
    error,
    history,
    historyLoading,
    handleSummarize,
    handleDelete,
    handleSelect,
    handleBack,
    loadHistory,
  } = useVideo();

  const { isDark, handleToggle } = useTheme();

  // Apply theme on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Fetch history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <>
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={handleToggle}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className={styles.container}>
        <main className={styles.main}>
          {error && <div className={styles.error}>{error}</div>}

          {!currentVideo ? (
            <URLInput onSubmit={handleSummarize} loading={loading} />
          ) : (
            <VideoResult data={currentVideo} onBack={handleBack} />
          )}
        </main>

        <aside className={styles.sidebar}>
          <History
            history={history}
            onSelect={handleSelect}
            onDelete={handleDelete}
            currentVideoId={currentVideo?.videoId}
            loading={historyLoading}
          />
        </aside>
      </div>
    </>
  );
}
