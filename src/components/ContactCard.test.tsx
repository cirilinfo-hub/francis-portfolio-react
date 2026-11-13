import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import * as api from '../lib/submitContact';
import { renderWithApp } from '../test/render';
import { ContactCard } from './ContactCard';

const field = (name: string) => screen.getByRole('textbox', { name });

describe('ContactCard validation', () => {
  it('shows an inline error on blur with icon text and aria wiring, and clears it when fixed', async () => {
    const user = userEvent.setup();
    renderWithApp(<ContactCard />);
    const email = field('Email');

    await user.type(email, 'asha@company');
    await user.tab();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveClass('is-error');
    expect(email).toHaveAccessibleDescription('Enter a full email address, like name@company.com.');

    await user.type(email, '.com');
    expect(email).not.toHaveAttribute('aria-invalid');
    expect(email).toHaveAccessibleDescription('Looks good');
  });

  it('blocks submit with errors on every empty field and focuses the first one', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(api, 'submitContact');
    renderWithApp(<ContactCard />);

    await user.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(field('Name')).toHaveFocus());
    expect(field('Name')).toHaveAccessibleDescription('Enter your name.');
    expect(field('Email')).toHaveAccessibleDescription('Enter your email address.');
    expect(field('Message')).toHaveAttribute('aria-invalid', 'true');
    expect(spy).not.toHaveBeenCalled();
  });

  it('submits valid input through submitContact and confirms', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(api, 'submitContact').mockResolvedValue({ ok: true });
    renderWithApp(<ContactCard />);

    await user.type(field('Name'), 'Asha Menon');
    await user.type(field('Email'), 'asha@company.com');
    await user.type(field('Message'), 'We need a design system for our product.');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Thanks, your message is on its way.',
    );
    expect(spy).toHaveBeenCalledWith({
      name: 'Asha Menon',
      email: 'asha@company.com',
      message: 'We need a design system for our product.',
    });
  });

  it('reports a failed request and keeps what was typed', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'submitContact').mockResolvedValue({
      ok: false,
      error: 'The message could not be sent.',
    });
    renderWithApp(<ContactCard />);

    await user.type(field('Name'), 'Asha Menon');
    await user.type(field('Email'), 'asha@company.com');
    await user.type(field('Message'), 'We need a design system for our product.');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('The message could not be sent.')).toBeInTheDocument();
    expect(screen.getByRole('status')).not.toHaveTextContent('Thanks');
    expect(field('Name')).toHaveValue('Asha Menon');
  });
});
