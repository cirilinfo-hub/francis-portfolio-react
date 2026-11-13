import { useActionState, useEffect, useOptimistic, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { contact } from '../data/site';
import { submitContact, type ContactMessage } from '../lib/submitContact';
import {
  validateContact,
  validateField,
  type Field,
  type FieldErrors,
} from '../lib/validateContact';
import { Button } from './ds';
import { Icon } from './Icon';
import { TextField } from './TextField';

interface FormState {
  status: 'idle' | 'invalid' | 'sent' | 'failed';
  errors: FieldErrors;
  values: ContactMessage;
  error?: string;
}

const EMPTY: ContactMessage = { name: '', email: '', message: '' };
const initial: FormState = { status: 'idle', errors: {}, values: EMPTY };

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="ccard-send"
    >
      {pending ? 'Sending…' : 'Send'}
    </Button>
  );
}

/**
 * Surface-raised form card on the violet band. React 19 form Action:
 * validation runs on blur (inline) and again in the action; the error state
 * follows States.dc.html (coral 2px edge, icon, text). The network call is
 * isolated in lib/submitContact.ts.
 */
export function ContactCard() {
  // Live, per-field validation from blur/change. An explicit `undefined`
  // means "fixed since the last submit" and hides the action's error.
  const [live, setLive] = useState<Partial<Record<Field, string | undefined>>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  // Shows the confirmation the moment a valid message is submitted; once the
  // request settles it falls back to the action result (gone if it failed).
  const [optimisticSent, setOptimisticSent] = useOptimistic(false, (_s, next: boolean) => next);

  const [state, formAction] = useActionState<FormState, FormData>(async (_prev, data) => {
    const values: ContactMessage = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };
    setLive({});
    const errors = validateContact(values);
    if (Object.keys(errors).length > 0) return { status: 'invalid', errors, values };

    setOptimisticSent(true);
    const result = await submitContact(values);
    if (!result.ok) return { status: 'failed', errors: {}, values, error: result.error };
    setTouched({});
    return { status: 'sent', errors: {}, values: EMPTY };
  }, initial);

  // After a failed submit, move focus to the first field with an error.
  useEffect(() => {
    if (state.status !== 'invalid') return;
    const first = (['name', 'email', 'message'] as const).find((f) => state.errors[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  const sent = optimisticSent || state.status === 'sent';
  const shown: FieldErrors = { ...state.errors, ...live };

  // Read the value during the event: state updaters run later, when currentTarget is null.
  const check = (field: Field) => (e: { currentTarget: { value: string } }) => {
    const error = validateField(field, e.currentTarget.value);
    setTouched((t) => ({ ...t, [field]: true }));
    setLive((l) => ({ ...l, [field]: error }));
  };
  // While a field shows an error, re-check on every keystroke so it clears as soon as it is fixed.
  const recheck = (field: Field) => (e: { currentTarget: { value: string } }) => {
    if (!shown[field]) return;
    const error = validateField(field, e.currentTarget.value);
    setLive((l) => ({ ...l, [field]: error }));
  };
  const ok = (field: Field) =>
    touched[field] && !shown[field] && field !== 'message' ? 'Looks good' : undefined;

  return (
    <form
      ref={formRef}
      className="ccard"
      aria-labelledby="ccard-title"
      noValidate
      action={formAction}
    >
      <h3 className="t-title" id="ccard-title">
        Send A Message
      </h3>
      <TextField
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
        defaultValue={state.values.name}
        error={shown.name}
        success={ok('name')}
        onBlur={check('name')}
        onChange={recheck('name')}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={state.values.email}
        error={shown.email}
        success={ok('email')}
        onBlur={check('email')}
        onChange={recheck('email')}
      />
      <TextField
        label="Message"
        name="message"
        multiline
        required
        placeholder="Tell me about your product and team"
        defaultValue={state.values.message}
        error={shown.message}
        onBlur={check('message')}
        onChange={recheck('message')}
      />
      <div className="ccard-foot">
        <span className="t-small">{contact.replyNote}</span>
        <SendButton />
      </div>
      <p className="ccard-status" role="status" aria-live="polite">
        {sent ? (
          <>
            <Icon name="check" size="sm" />
            Thanks, your message is on its way.
          </>
        ) : state.status === 'failed' ? (
          <span className="field-msg error">
            <Icon name="alert" size="sm" />
            {state.error}
          </span>
        ) : null}
      </p>
    </form>
  );
}
