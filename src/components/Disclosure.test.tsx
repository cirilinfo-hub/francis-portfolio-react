import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithApp } from '../test/render';
import { Disclosure } from './Disclosure';

describe('Disclosure', () => {
  it('toggles aria-expanded, its label and the controlled region', async () => {
    const user = userEvent.setup();
    renderWithApp(
      <Disclosure label="See Earlier Roles (3)" openLabel="Hide Earlier Roles">
        <p key="body">Web Designer</p>
      </Disclosure>,
    );
    const button = screen.getByRole('button', { name: 'See Earlier Roles (3)' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    const region = document.getElementById(button.getAttribute('aria-controls') ?? '');
    expect(region).not.toBeNull();
    expect(screen.queryByText('Web Designer')).not.toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAccessibleName('Hide Earlier Roles');
    expect(region).toContainElement(screen.getByText('Web Designer'));

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(screen.queryByText('Web Designer')).not.toBeInTheDocument());
  });
});
