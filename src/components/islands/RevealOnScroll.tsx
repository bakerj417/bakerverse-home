import { useEffect, useRef, type PropsWithChildren } from 'react';

/**
 * RevealOnScroll — adds `.is-visible` when the element enters
 * the viewport, paired with the `.reveal` base class in
 * global.css for a fade-up. Uses IntersectionObserver, falls
 * through to visible on browsers that don't support it.
 */
export default function RevealOnScroll({
  delayMs = 0,
  children,
  as: Tag = 'div',
  className = '',
}: PropsWithChildren<{
  delayMs?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}>) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delayMs > 0) {
              setTimeout(() => el.classList.add('is-visible'), delayMs);
            } else {
              el.classList.add('is-visible');
            }
            observer.disconnect();
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  // Cast because TS struggles with generic HTML-tag refs.
  const AnyTag = Tag as unknown as React.ElementType;
  return (
    <AnyTag ref={ref as React.RefObject<any>} className={`reveal ${className}`}>
      {children}
    </AnyTag>
  );
}
