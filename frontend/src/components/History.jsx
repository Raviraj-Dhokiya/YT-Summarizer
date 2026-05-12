import styles from './History.module.css';
import { formatShortDate, getThumbnailUrl } from '../utils/helpers';

export default function History({ history, onSelect, onDelete, currentVideoId, loading }) {
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.heading}>History</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`skeleton ${styles.skeleton}`} />
        ))}
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.heading}>History</h3>
        <div className={styles.empty}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <p>No history yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>
        History
        <span className={styles.count}>{history.length}</span>
      </h3>
      <div className={styles.list}>
        {history.map((video) => (
          <div
            key={video.videoId}
            className={`${styles.item} ${video.videoId === currentVideoId ? styles.active : ''}`}
          >
            <button className={styles.itemBtn} onClick={() => onSelect(video)}>
              <img
                src={video.thumbnail || getThumbnailUrl(video.videoId)}
                alt={video.title}
                className={styles.thumb}
                onError={(e) => {
                  e.target.src = getThumbnailUrl(video.videoId);
                }}
              />
              <div className={styles.info}>
                <p className={styles.itemTitle}>{video.title}</p>
                <p className={styles.itemDate}>{formatShortDate(video.createdAt)}</p>
              </div>
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(video.videoId);
              }}
              title="Remove from history"
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
