export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

const FALLBACK_ERROR = 'The message could not be sent. Try again or email me.';

/**
 * The one place the contact form talks to a backend: `public/api/contact.php`
 * on Hostinger, which emails the message (see README "Contact form").
 * The Vite dev server cannot run PHP, so in development it simulates a short
 * round trip and succeeds.
 */
export async function submitContact(msg: ContactMessage): Promise<SubmitResult> {
  if (import.meta.env.DEV) {
    await new Promise((r) => setTimeout(r, 700));
    return { ok: true };
  }
  try {
    const res = await fetch('/api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(msg),
    });
    const data = (await res.json().catch(() => null)) as SubmitResult | null;
    if (res.ok && data?.ok) return { ok: true };
    return { ok: false, error: data && !data.ok && data.error ? data.error : FALLBACK_ERROR };
  } catch {
    return { ok: false, error: FALLBACK_ERROR };
  }
}
