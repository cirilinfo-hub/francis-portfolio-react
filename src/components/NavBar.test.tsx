import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithApp } from '../test/render';
import { NavBar } from './NavBar';

describe('MenuSheet', () => {
  it('opens with focus on the first link, traps Tab, and Esc returns focus to the menu button', async () => {
    const user = userEvent.setup();
    renderWithApp(<NavBar />);
    const menuButton = screen.getByRole('button', { name: 'Open menu' });

    await user.click(menuButton);
    const dialog = await screen.findByRole('dialog', { name: 'Site menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(screen.getAllByRole('link', { name: 'About' }).at(-1)).toHaveFocus();

    // Tab past the last control wraps to the first; Shift+Tab from the first wraps to the last.
    for (let i = 0; i < 15; i++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(menuButton).toHaveFocus();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('closes from the close button', async () => {
    const user = userEvent.setup();
    renderWithApp(<NavBar />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(await screen.findByRole('button', { name: 'Close menu' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
