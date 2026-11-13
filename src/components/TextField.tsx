import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Icon } from './Icon';

type Base = {
  label: string;
  /** Error text. Shows the coral 2px edge, an icon and the message (never colour alone). */
  error?: string | undefined;
  /** Positive confirmation, e.g. "Looks good". */
  success?: string | undefined;
  hint?: string | undefined;
};

type InputProps = Base & { multiline?: false } & InputHTMLAttributes<HTMLInputElement>;
type AreaProps = Base & { multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Label, input and message: default, focus, filled and error states (States.dc.html). */
export function TextField(props: InputProps | AreaProps) {
  const autoId = useId();
  const { label, error, success, hint, multiline, id = autoId, className, ...rest } = props;
  const msgId = `${id}-msg`;
  const message = error ?? success ?? hint;
  const common = {
    id,
    className: ['input', error && 'is-error', className].filter(Boolean).join(' '),
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': message ? msgId : undefined,
  };

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...common} />
      ) : (
        <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} {...common} />
      )}
      {message ? (
        <p className={['field-msg', error && 'error'].filter(Boolean).join(' ')} id={msgId}>
          {error ? <Icon name="alert" /> : success ? <Icon name="check" /> : null}
          {message}
        </p>
      ) : null}
    </div>
  );
}
