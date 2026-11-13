import type { ContactMessage } from './submitContact';

export type Field = keyof ContactMessage;
export type FieldErrors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Same limits as public/api/contact.php. */
export const LIMITS = { name: 100, email: 254, message: 5000 } as const;

export function validateField(field: Field, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case 'name':
      if (!v) return 'Enter your name.';
      return v.length > LIMITS.name ? `Keep your name under ${LIMITS.name} characters.` : undefined;
    case 'email':
      if (!v) return 'Enter your email address.';
      return v.length <= LIMITS.email && EMAIL.test(v)
        ? undefined
        : 'Enter a full email address, like name@company.com.';
    case 'message':
      if (!v) return 'Tell me a little about your product and team.';
      if (v.length < 10) return 'Add a little more detail, at least 10 characters.';
      return v.length > LIMITS.message
        ? `Keep your message under ${LIMITS.message} characters.`
        : undefined;
  }
}

export function validateContact(msg: ContactMessage): FieldErrors {
  const errors: FieldErrors = {};
  for (const f of ['name', 'email', 'message'] as const) {
    const e = validateField(f, msg[f]);
    if (e) errors[f] = e;
  }
  return errors;
}
