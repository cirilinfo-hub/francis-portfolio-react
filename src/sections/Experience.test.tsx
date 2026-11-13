import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithApp } from '../test/render';
import { Experience } from './Experience';

describe('Experience accordion', () => {
  it('opens one role at a time and hides details again', async () => {
    const user = userEvent.setup();
    renderWithApp(<Experience />);

    const eurofins = screen.getByRole('button', { name: /Show details for Eurofins/ });
    const wipro = screen.getByRole('button', { name: /Show details for Wipro/ });
    expect(eurofins).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/Improved page load time by 20%/)).not.toBeInTheDocument();

    await user.click(eurofins);
    expect(eurofins).toHaveAttribute('aria-expanded', 'true');
    expect(eurofins).toHaveAccessibleName(/Hide details/);
    expect(screen.getByText(/Improved page load time by 20%/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Global Management Access/ })).toHaveAttribute(
      'href',
      '/projects/gma',
    );

    await user.click(wipro);
    expect(wipro).toHaveAttribute('aria-expanded', 'true');
    expect(eurofins).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(screen.queryByText(/Improved page load time by 20%/)).not.toBeInTheDocument(),
    );

    await user.click(wipro);
    expect(wipro).toHaveAttribute('aria-expanded', 'false');
  });

  it('gives roles without extra detail no toggle', () => {
    renderWithApp(<Experience />);
    expect(screen.queryByRole('button', { name: /details for Ocean Pages/ })).toBeNull();
  });
});
