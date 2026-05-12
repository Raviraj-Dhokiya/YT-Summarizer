import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

/**
 * Custom hook that exposes theme state and toggle action.
 * Also applies data-theme attribute to <html> element on toggle.
 */
export function useTheme() {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return {
    isDark,
    handleToggle,
  };
}
