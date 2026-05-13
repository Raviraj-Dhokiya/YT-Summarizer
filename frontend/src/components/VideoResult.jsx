import { useState } from 'react';
import { VIDEO_TABS } from '../constants';
import { formatDate } from '../utils/helpers';

export default function VideoResult({ data, onBack }) {
  const [activeTab, setActiveTab] = useState('Summary');
  const [playerTime, setPlayerTime] = useState(0);

  const embedUrl = `https://www.youtube.com/embed/${data.videoId}?start=${playerTime}&autoplay=${playerTime > 0 ? 1 : 0}`;

  const jumpTo = (seconds) => {
    setPlayerTime(seconds + 1);
    setTimeout(() => {
      document.querySelector('iframe')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="animate-fade-up">

      {/* Back button */}
      <button
        id="back-btn"
        onClick={onBack}
        style={{ marginBottom: 20 }}
        className="
          inline-flex items-center gap-1.5 px-[18px] py-[9px]
          bg-transparent text-[#555] dark:text-[#909090] text-sm font-medium
          border border-[#e0e0e0] dark:border-[#2e2e2e] rounded-lg cursor-pointer
          transition-all duration-150
          hover:bg-[#f0f0f0] dark:hover:bg-[#242424]
          hover:text-[#111] dark:hover:text-[#f0f0f0]
        "
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      {/* Grid: Left + Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

        {/* LEFT: Video + meta */}
        <div className="flex flex-col gap-3.5">

          {/* Player */}
          <div className="
            relative pb-[56.25%] h-0
            rounded-lg overflow-hidden
            border border-[#e0e0e0] dark:border-[#2e2e2e]
          ">
            <iframe
              key={playerTime}
              src={embedUrl}
              title={data.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>

          {/* Meta */}
          <div className="
            bg-white dark:bg-[#1a1a1a]
            border border-[#e0e0e0] dark:border-[#2e2e2e]
            rounded-lg px-4 py-3.5
            flex flex-col gap-2
          ">
            {/* Analyzed badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-[#34d058] text-[11px] font-medium w-fit">
              ✓ Analyzed
            </span>

            <h2 className="text-[15px] font-semibold text-[#111] dark:text-[#f0f0f0] leading-snug">
              {data.title}
            </h2>

            <div className="flex items-center gap-2">
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#1a6ef5] text-xs no-underline hover:underline"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Watch on YouTube
              </a>
              <span className="text-[#999] dark:text-[#555] text-xs">·</span>
              <span className="text-xs text-[#999] dark:text-[#555]">{formatDate(data.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Tabs */}
        <div className="
          bg-white dark:bg-[#1a1a1a]
          border border-[#e0e0e0] dark:border-[#2e2e2e]
          rounded-xl overflow-hidden
        ">
          {/* Tab bar */}
          <div className="
            flex border-b border-[#e0e0e0] dark:border-[#2e2e2e]
            bg-[#f0f0f0] dark:bg-[#242424]
          ">
            {VIDEO_TABS.map((tab) => (
              <button
                key={tab}
                id={`tab-${tab.toLowerCase().replace(' ', '-')}`}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-2.5 px-3 bg-transparent border-none text-[13px] font-medium font-sans cursor-pointer
                  border-b-2 transition-all duration-150
                  ${activeTab === tab
                    ? 'text-[#e00000] dark:text-[#ff4444] border-[#e00000] dark:border-[#ff4444] bg-white dark:!bg-[#1a1a1a]'
                    : 'text-[#555] dark:text-[#909090] border-transparent hover:text-[#111] dark:hover:text-[#f0f0f0]'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5 min-h-[340px]">

            {/* Summary Tab */}
            {activeTab === 'Summary' && (
              <div>
                <div className="mb-0">
                  <div className="mb-3">
                    <h3 className="text-[15px] font-semibold text-[#111] dark:text-[#f0f0f0] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff4444]"></span>
                      Quick Summary
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#111] dark:text-[#f0f0f0]">
                    {data.shortSummary}
                  </p>
                </div>

                <hr className="border-none border-t border-[#e0e0e0] dark:border-[#2e2e2e] my-[18px]" />

                <div>
                  <div className="mb-3">
                    <h3 className="text-[15px] font-semibold text-[#111] dark:text-[#f0f0f0] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"></span>
                      Detailed Description
                    </h3>
                  </div>
                  <p className="text-[13px] leading-[1.8] text-[#555] dark:text-[#909090]">
                    {data.detailedSummary}
                  </p>
                </div>
              </div>
            )}

            {/* Key Points Tab */}
            {activeTab === 'Key Points' && (
              <div>
                <p className="text-xs text-[#999] dark:text-[#555] mb-3.5">Core takeaways from this video</p>
                <ul className="list-none flex flex-col gap-2">
                  {data.keyPoints?.map((point, i) => (
                    <li
                      key={i}
                      className="
                        flex items-start gap-2.5 px-3 py-2.5
                        bg-[#f0f0f0] dark:bg-[#242424]
                        border border-[#e0e0e0] dark:border-[#2e2e2e]
                        rounded-lg
                        hover:border-[#d0d0d0] dark:hover:border-[#3a3a3a]
                        transition-colors duration-150
                      "
                    >
                      <span className="text-[11px] font-semibold text-[#e00000] dark:text-[#ff4444] flex-shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[13px] text-[#111] dark:text-[#f0f0f0] leading-snug">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timestamps Tab */}
            {activeTab === 'Timestamps' && (
              <div>
                <p className="text-xs text-[#999] dark:text-[#555] mb-3.5">Click any section to jump to that moment</p>
                <div className="flex flex-col gap-1.5">
                  {data.timestamps?.length > 0 ? (
                    data.timestamps.map((ts, i) => (
                      <button
                        key={i}
                        onClick={() => jumpTo(ts.seconds)}
                        className="
                          flex items-center gap-2.5 px-3 py-[9px]
                          bg-[#f0f0f0] dark:bg-[#242424]
                          border border-[#e0e0e0] dark:border-[#2e2e2e]
                          rounded-lg cursor-pointer text-left w-full
                          group transition-colors duration-150
                          hover:border-[#1a6ef5]
                        "
                      >
                        <span className="text-xs font-semibold text-[#e00000] dark:text-[#ff4444] flex-shrink-0 min-w-[38px]">
                          {ts.time}
                        </span>
                        <div className="w-px h-3.5 bg-[#d0d0d0] dark:bg-[#3a3a3a] flex-shrink-0" />
                        <span className="text-[13px] text-[#111] dark:text-[#f0f0f0] flex-1">
                          {ts.title}
                        </span>
                        <svg
                          className="text-[#999] dark:text-[#555] opacity-0 group-hover:opacity-100 group-hover:text-[#1a6ef5] flex-shrink-0 transition-all duration-150"
                          width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <p className="text-[#999] dark:text-[#555] text-[13px] py-5">
                      No timestamp sections available.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
