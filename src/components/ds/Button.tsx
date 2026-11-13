import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { Link } from 'react-router';
import { buttonClass, type Size, type Variant } from './buttonClass';

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type AsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; to?: undefined; ref?: Ref<HTMLButtonElement> };
type AsAnchor = Common &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined; ref?: Ref<HTMLAnchorElement> };
type AsLink = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; href?: undefined; ref?: Ref<HTMLAnchorElement> };

export type ButtonProps = AsButton | AsAnchor | AsLink;

/** Pill button. Renders <a> with `href`, a router <Link> with `to`, otherwise <button type="button">. */
export function Button(props: ButtonProps) {
  if (props.to !== undefined) {
    const { variant, size, className, children, to, ...rest } = props;
    return (
      <Link {...rest} to={to} className={buttonClass(variant, size, className)}>
        {children}
      </Link>
    );
  }
  if (props.href !== undefined) {
    const { variant, size, className, children, ...rest } = props;
    return (
      <a {...rest} className={buttonClass(variant, size, className)}>
        {children}
      </a>
    );
  }
  const { variant, size, className, children, type = 'button', ...rest } = props;
  return (
    <button {...rest} type={type} className={buttonClass(variant, size, className)}>
      {children}
    </button>
  );
}
