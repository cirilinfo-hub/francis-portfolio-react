import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitContact } from './submitContact';

const msg = { name: 'Asha', email: 'asha@company.com', message: 'We need a design system.' };
const respond = (status: number, body: unknown) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe('submitContact (production)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('posts JSON to the PHP endpoint', async () => {
    vi.stubEnv('DEV', false);
    const fetchMock = respond(200, { ok: true });
    vi.stubGlobal('fetch', fetchMock);
    await expect(submitContact(msg)).resolves.toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/contact.php');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual(msg);
  });

  it("passes on the server's error message", async () => {
    vi.stubEnv('DEV', false);
    vi.stubGlobal('fetch', respond(429, { ok: false, error: 'Too many messages.' }));
    await expect(submitContact(msg)).resolves.toEqual({ ok: false, error: 'Too many messages.' });
  });

  it('falls back to a generic error when the network fails', async () => {
    vi.stubEnv('DEV', false);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    const res = await submitContact(msg);
    expect(res.ok).toBe(false);
  });
});
