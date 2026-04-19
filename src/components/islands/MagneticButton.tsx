import { useRef, useCallback, type PropsWithChildren, type MouseEvent } from 'react';
import clsx from 'clsx';

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'gold' | 'ghost';
  className?: string;
  strength?: number;
  external?: boolean;
  ariaLabel?: string;
}

/**
 * MagneticButton — a gold or ghost CTA that gently gravitates
 * toward the cursor within a small radius. Disabled under
 * prefers-reduced-motion. Works as <a> or <button> depending on
 * whether `href` is supplied.
 */
export default function MagneticButton({
  href,
  onClick,
  variant = 'gold',
  className,
  strength = 0.3,
  external,
  ariaLabel,
  children,
}: PropsWithChildren<MagneticButtonProps>) {
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength],
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }, []);

  const variantClass = variant === 'gold' ? 'btn-gold' : 'btn-ghost';
  const classes = clsx(variantClass, 'magnetic-button', className);

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </button>
  );
}
