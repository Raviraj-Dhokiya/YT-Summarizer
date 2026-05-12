import { useState } from 'react';
import styles from './VideoResult.module.css';
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
    <div className={styles.wrapper}>
      {/* Back button */}
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: 20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </button>

      <div className={styles.grid}>
        {/* Left: Video + meta */}
        <div className={styles.left}>
          <div className={styles.playerWrap}>
            <iframe
              key={playerTime}
              src={embedUrl}
              title={data.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.player}
            />
          </div>

          <div className={styles.meta}>
            <span className="badge badge-green">✓ Analyzed</span>
            <h2 className={styles.videoTitle}>{data.title}</h2>
            <div className={styles.metaRow}>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Watch on YouTube
              </a>
              <span className={styles.dot}>·</span>
              <span className={styles.metaText}>{formatDate(data.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right: Tabs */}
        <div className={styles.right}>
          <div className={styles.tabBar}>
            {VIDEO_TABS.map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'Summary' && (
              <div className={styles.summaryTab}>
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className="badge badge-accent">TL;DR</span>
                  </div>
                  <p className={styles.shortSummary}>{data.shortSummary}</p>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className="badge badge-purple">Full Summary</span>
                  </div>
                  <p className={styles.detailedSummary}>{data.detailedSummary}</p>
                </div>
              </div>
            )}

            {activeTab === 'Key Points' && (
              <div className={styles.keyPointsTab}>
                <p className={styles.tabDesc}>Core takeaways from this video</p>
                <ul className={styles.keyList}>
                  {data.keyPoints?.map((point, i) => (
                    <li key={i} className={styles.keyItem}>
                      <span className={styles.keyNum}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.keyText}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'Timestamps' && (
              <div className={styles.timestampsTab}>
                <p className={styles.tabDesc}>Click any section to jump to that moment</p>
                <div className={styles.timeline}>
                  {data.timestamps?.length > 0 ? (
                    data.timestamps.map((ts, i) => (
                      <button
                        key={i}
                        className={styles.tsItem}
                        onClick={() => jumpTo(ts.seconds)}
                      >
                        <span className={styles.tsTime}>{ts.time}</span>
                        <div className={styles.tsBar} />
                        <span className={styles.tsTitle}>{ts.title}</span>
                        <svg className={styles.tsPlay} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </button>
                    ))
                  ) : (
                    <p className={styles.noTs}>No timestamp sections available.</p>
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
