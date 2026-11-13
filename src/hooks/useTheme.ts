import { useSyncExternalStore } from 'react';
import { getTheme, setTheme, subscribeTheme, type Theme } from '../lib/theme';

export function useTheme(): [Theme, typeof setTheme] {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'light' as Theme);
  return [theme, setTheme];
}
