import { useEffect } from 'react';
import URLInput from './components/URLInput';
import VideoResult from './components/VideoResult';
import History from './components/History';
import { useVideo } from './hooks/useVideo';
import { useTheme } from './hooks/useTheme';
import './index.css';

export default function App() {
  const {
    currentVideo,
    loading,
    error,
    history,
    historyLoading,
    historyError,
    handleSummarize,
    handleDelete,
    handleSelect,
    handleBack,
    handleClearError,
    loadHistory,
  } = useVideo();

  const { isDark, handleToggle } = useTheme();

  // Apply Tailwind dark class + data-theme attribute on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  // Fetch history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0f0f0f] text-[#111111] dark:text-[#f0f0f0] font-sans transition-colors duration-300">

      {/* Theme Toggle Button */}
      <button
        id="theme-toggle"
        onClick={handleToggle}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
        className="fixed top-4 right-5 z-[999] w-[38px] h-[38px] flex items-center justify-center
          bg-white dark:bg-[#1a1a1a]
          border border-[#e0e0e0] dark:border-[#2e2e2e]
          text-[#555] dark:text-[#909090]
          rounded-lg text-lg cursor-pointer
          transition-all duration-150
          hover:bg-[#f0f0f0] dark:hover:bg-[#242424]
          hover:text-[#111] dark:hover:text-[#f0f0f0]
          hover:border-[#d0d0d0] dark:hover:border-[#3a3a3a]"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Main layout */}
      <div className="flex max-w-[1400px] mx-auto min-h-screen px-5 py-10 gap-10 flex-col lg:flex-row">

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          {error && (
            <div className="
              relative
              bg-blue-500/10 text-[#1d4ed8] dark:text-[#60a5fa]
              px-4 py-3 pr-10 rounded-lg mb-6
              border border-blue-500/20
            ">
              {error}
              <button
                onClick={handleClearError}
                title="Dismiss"
                aria-label="Dismiss error"
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-[#1d4ed8] dark:text-[#60a5fa]
                  opacity-60 hover:opacity-100
                  transition-opacity cursor-pointer
                  bg-transparent border-none p-1
                "
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          )}

          {!currentVideo ? (
            <URLInput onSubmit={(url, lang) => handleSummarize(url, lang)} loading={loading} />
          ) : (
            <VideoResult data={currentVideo} onBack={handleBack} />
          )}
        </main>

        {/* Sidebar */}
        <aside className="lg:w-[340px] flex-shrink-0">
          <History
            history={history}
            onSelect={handleSelect}
            onDelete={handleDelete}
            currentVideoId={currentVideo?.videoId}
            loading={historyLoading}
            error={historyError}
          />
        </aside>
      </div>
    </div>
  );
}
