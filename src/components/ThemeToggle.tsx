import type { MouseEvent } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../lib/theme';
import { Icon } from './Icon';

/** Light/Dark segmented pill using aria-pressed. The change is revealed as a circle from the button. */
export function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  const choose = (next: Theme) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div className="theme-toggle" role="group" aria-label="Colour theme">
      <button type="button" aria-pressed={theme === 'light'} onClick={choose('light')}>
        <Icon name="sun" size="sm" />
        Light
      </button>
      <button type="button" aria-pressed={theme === 'dark'} onClick={choose('dark')}>
        <Icon name="moon" size="sm" />
        Dark
      </button>
    </div>
  );
}
