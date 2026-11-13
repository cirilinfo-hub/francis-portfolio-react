export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * The one place the contact form talks to a backend. Replace the body with a
 * real request, for example:
 *
 *   const res = await fetch('/api/contact', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(msg),
 *   });
 *   return res.ok ? { ok: true } : { ok: false, error: 'The message could not be sent. Try again or email me.' };
 *
 * Until then it simulates a short network round trip and succeeds.
 */
export async function submitContact(msg: ContactMessage): Promise<SubmitResult> {
  void msg;
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true };
}
