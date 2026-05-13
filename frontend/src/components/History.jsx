import { formatShortDate, getThumbnailUrl } from '../utils/helpers';

export default function History({ history, onSelect, onDelete, currentVideoId, loading }) {

  if (loading) {
    return (
      <div className="
        bg-white dark:bg-[#1a1a1a]
        rounded-xl border border-[#e0e0e0] dark:border-[#2e2e2e]
        p-6 flex flex-col
        h-[calc(100vh-80px)] sticky top-10
      ">
        <h3 className="text-[18px] font-semibold text-[#111] dark:text-[#f0f0f0] mb-5">History</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-[70px] mb-3 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="
        bg-white dark:bg-[#1a1a1a]
        rounded-xl border border-[#e0e0e0] dark:border-[#2e2e2e]
        p-6 flex flex-col
        h-[calc(100vh-80px)] sticky top-10
      ">
        <h3 className="text-[18px] font-semibold text-[#111] dark:text-[#f0f0f0] mb-5">History</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-[#555] dark:text-[#909090] gap-3 text-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <p>No history yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="
      bg-white dark:bg-[#1a1a1a]
      rounded-xl border border-[#e0e0e0] dark:border-[#2e2e2e]
      p-6 flex flex-col
      h-[calc(100vh-80px)] sticky top-10
    ">
      {/* Heading */}
      <h3 className="text-[18px] font-semibold text-[#111] dark:text-[#f0f0f0] mb-5 flex items-center justify-between">
        History
        <span className="
          bg-[#f0f0f0] dark:bg-[#242424]
          text-[#555] dark:text-[#909090]
          text-xs px-2 py-0.5 rounded-full
        ">
          {history.length}
        </span>
      </h3>

      {/* List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
        {history.map((video) => (
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
            {/* Clickable area */}
            <button
              className="flex-1 flex items-center gap-3 bg-transparent border-none text-left cursor-pointer min-w-0 p-0"
              onClick={() => onSelect(video)}
            >
              <img
                src={video.thumbnail || getThumbnailUrl(video.videoId)}
                alt={video.title}
                className="w-[90px] h-[50px] object-cover rounded-[6px] flex-shrink-0"
                onError={(e) => {
                  e.target.src = getThumbnailUrl(video.videoId);
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="
                  text-[13px] font-medium text-[#111] dark:text-[#f0f0f0]
                  whitespace-nowrap overflow-hidden text-ellipsis mb-1
                ">
                  {video.title}
                </p>
                <p className="text-[11px] text-[#555] dark:text-[#909090]">
                  {formatShortDate(video.createdAt)}
                </p>
              </div>
            </button>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(video.videoId);
              }}
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
        ))}
      </div>
    </div>
  );
}
