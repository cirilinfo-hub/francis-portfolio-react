import type { ContactMessage } from './submitContact';

export type Field = keyof ContactMessage;
export type FieldErrors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(field: Field, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case 'name':
      return v ? undefined : 'Enter your name.';
    case 'email':
      if (!v) return 'Enter your email address.';
      return EMAIL.test(v) ? undefined : 'Enter a full email address, like name@company.com.';
    case 'message':
      if (!v) return 'Tell me a little about your product and team.';
      return v.length < 10 ? 'Add a little more detail, at least 10 characters.' : undefined;
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
