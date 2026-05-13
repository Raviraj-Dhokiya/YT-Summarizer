import { useState } from 'react';
import { formatShortDate, getThumbnailUrl } from '../utils/helpers';

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// Highlight matched text in red
function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#2563eb]/15 dark:bg-[#60a5fa]/20 text-[#2563eb] dark:text-[#60a5fa] rounded px-0.5 not-italic font-semibold">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({ video, onConfirm, onCancel }) {
  if (!video) return null;
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="
          relative z-10
          bg-white dark:bg-[#1a1a1a]
          border border-[#e0e0e0] dark:border-[#2e2e2e]
          rounded-2xl shadow-2xl shadow-black/20
          w-full max-w-[340px] p-6
          animate-fade-up
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/15 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" className="dark:stroke-[#60a5fa]">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-[16px] font-semibold text-[#111] dark:text-[#f0f0f0] text-center mb-1">
          Delete from History?
        </h4>

        {/* Video title */}
        <p className="text-[12px] text-[#555] dark:text-[#909090] text-center mb-5 leading-relaxed px-2">
          <span className="font-medium text-[#111] dark:text-[#f0f0f0]">"{video.title}"</span>
          {' '}will be permanently removed from your history.
        </p>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            id="delete-cancel-btn"
            onClick={onCancel}
            className="
              flex-1 py-2.5 text-[13px] font-medium
              bg-[#f0f0f0] dark:bg-[#242424]
              border border-[#e0e0e0] dark:border-[#2e2e2e]
              text-[#555] dark:text-[#909090]
              rounded-xl cursor-pointer
              transition-all duration-150
              hover:bg-[#e8e8e8] dark:hover:bg-[#2e2e2e]
              hover:text-[#111] dark:hover:text-[#f0f0f0]
            "
          >
            Cancel
          </button>
          <button
            id="delete-confirm-btn"
            onClick={onConfirm}
            className="
              flex-1 py-2.5 text-[13px] font-medium
              bg-[#2563eb] dark:bg-[#60a5fa] text-white
              rounded-xl cursor-pointer
              transition-all duration-150
              hover:opacity-85
            "
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main History Component ────────────────────────────────────────────────────
export default function History({ history, onSelect, onDelete, currentVideoId, loading, error }) {
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null); // video object to confirm

  const filtered = history.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (e, video) => {
    e.stopPropagation();
    setPendingDelete(video);
  };

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      onDelete(pendingDelete.videoId);
      setPendingDelete(null);
    }
  };

  const handleCancelDelete = () => setPendingDelete(null);

  // ── Shared header + search ────────────────────────────────────────────────
  const header = (
    <div className="mb-4">
      <h3 className="text-[18px] font-semibold text-[#111] dark:text-[#f0f0f0] mb-3 flex items-center justify-between">
        History
        <span className="bg-[#f0f0f0] dark:bg-[#242424] text-[#555] dark:text-[#909090] text-xs px-2 py-0.5 rounded-full">
          {loading ? 0 : filtered.length}
        </span>
      </h3>
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999] dark:text-[#555] pointer-events-none">
          <SearchIcon />
        </span>
        <input
          id="history-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="
            w-full pl-8 pr-8 py-2
            bg-[#f0f0f0] dark:bg-[#242424]
            border border-[#e0e0e0] dark:border-[#2e2e2e]
            rounded-lg text-[12px] font-sans
            text-[#111] dark:text-[#f0f0f0]
            placeholder-[#999] dark:placeholder-[#555]
            outline-none transition-all duration-150
            focus:border-[#2563eb] dark:focus:border-[#60a5fa]
            focus:shadow-[0_0_0_2px_rgba(37,99,235,0.12)]
          "
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999] dark:text-[#555] hover:text-[#111] dark:hover:text-[#f0f0f0] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#e0e0e0] dark:border-[#2e2e2e] p-6 flex flex-col h-[calc(100vh-80px)] sticky top-10">
        {header}
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-[70px] mb-3 rounded-lg" />
        ))}
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#e0e0e0] dark:border-[#2e2e2e] p-6 flex flex-col h-[calc(100vh-80px)] sticky top-10">
        {header}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400 opacity-70">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-[12px] text-[#555] dark:text-[#909090]">
            Could not load history.
          </p>
          <p className="text-[11px] text-[#999] dark:text-[#555] max-w-[200px]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (!history.length) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#e0e0e0] dark:border-[#2e2e2e] p-6 flex flex-col h-[calc(100vh-80px)] sticky top-10">
        {header}
        <div className="flex-1 flex flex-col items-center justify-center text-[#555] dark:text-[#909090] gap-3 text-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <p>No history yet</p>
        </div>
      </div>
    );
  }

  // ── Main list ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Confirm delete modal */}
      <DeleteConfirmModal
        video={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#e0e0e0] dark:border-[#2e2e2e] p-6 flex flex-col h-[calc(100vh-80px)] sticky top-10">
        {header}

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
          {filtered.length > 0 ? (
            filtered.map((video) => (
              <div
                key={video.videoId}
                className={`
                  flex items-center gap-3 px-2.5 py-2.5 rounded-lg
                  border transition-all duration-200 cursor-pointer
                  ${video.videoId === currentVideoId
                    ? 'bg-[#f0f0f0] dark:bg-[#242424] border-[#d0d0d0] dark:border-[#3a3a3a]'
                    : 'border-transparent hover:bg-[#f0f0f0] dark:hover:bg-[#242424]'
                  }
                `}
              >
                <button
                  className="flex-1 flex items-center gap-3 bg-transparent border-none text-left cursor-pointer min-w-0 p-0"
                  onClick={() => onSelect(video)}
                >
                  <img
                    src={video.thumbnail || getThumbnailUrl(video.videoId)}
                    alt={video.title}
                    className="w-[90px] h-[50px] object-cover rounded-[6px] flex-shrink-0"
                    onError={(e) => { e.target.src = getThumbnailUrl(video.videoId); }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#111] dark:text-[#f0f0f0] whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                      {search ? highlightMatch(video.title, search) : video.title}
                    </p>
                    <p className="text-[11px] text-[#555] dark:text-[#909090]">
                      {formatShortDate(video.createdAt)}
                    </p>
                  </div>
                </button>

                {/* Delete button — opens confirm modal */}
                <button
                  onClick={(e) => handleDeleteClick(e, video)}
                  title="Remove from history"
                  className="
                    bg-transparent border border-transparent
                    text-[#cc0000] dark:text-[#ff4444]
                    p-1.5 rounded cursor-pointer
                    transition-all duration-150
                    hover:bg-red-500/10 hover:border-red-500/30
                  "
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p className="text-[12px] text-[#999] dark:text-[#555] text-center">
                No results for<br/>
                <span className="font-medium text-[#555] dark:text-[#909090]">"{search}"</span>
              </p>
              <button
                onClick={() => setSearch('')}
                  className="text-[11px] text-[#2563eb] dark:text-[#60a5fa] hover:underline cursor-pointer mt-1"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
