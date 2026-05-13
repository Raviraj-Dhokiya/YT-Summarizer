import { useDispatch, useSelector } from 'react-redux';
import { summarizeVideo, clearVideo, clearError } from '../store/videoSlice';
import { fetchHistory, deleteVideo } from '../store/historySlice';

/**
 * Custom hook that encapsulates all video-related state and actions.
 * Keeps App.jsx clean by abstracting Redux dispatch logic.
 */
export function useVideo() {
  const dispatch = useDispatch();
  const { currentVideo, loading, error } = useSelector((state) => state.video);
  const { items: history, loading: historyLoading, error: historyError } = useSelector((state) => state.history);

  const handleSummarize = (url, language = 'English') => {
    dispatch(summarizeVideo({ url, language })).then((action) => {
      if (summarizeVideo.fulfilled.match(action)) {
        dispatch(fetchHistory());
      }
    });
  };

  const handleDelete = (videoId) => {
    dispatch(deleteVideo(videoId)).then(() => {
      if (currentVideo?.videoId === videoId) {
        dispatch(clearVideo());
      }
    });
  };

  const handleSelect = (video) => {
    dispatch({ type: 'video/setVideo', payload: video });
  };

  const handleBack = () => {
    dispatch(clearVideo());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const loadHistory = () => {
    dispatch(fetchHistory());
  };

  return {
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
  };
}
