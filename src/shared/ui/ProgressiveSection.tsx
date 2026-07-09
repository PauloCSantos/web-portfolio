import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ProgressiveSectionProps = {
  anchorId: string;
  children: ReactNode;
  fallback?: ReactNode;
  minHeight: string;
  rootMargin?: string;
};

export function ProgressiveSection({
  anchorId,
  children,
  fallback = null,
  minHeight,
  rootMargin = "300px 0px",
}: ProgressiveSectionProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      const timeoutId = globalThis.setTimeout(() => {
        startTransition(() => {
          setShouldRender(true);
        });
      }, 0);

      return () => globalThis.clearTimeout(timeoutId);
    }

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const placeholder = placeholderRef.current;

    if (!placeholder) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        observer.disconnect();
        startTransition(() => {
          setShouldRender(true);
        });
      },
      { rootMargin },
    );

    observer.observe(placeholder);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  if (shouldRender) {
    return <>{children}</>;
  }

  return (
    <div
      id={anchorId}
      ref={placeholderRef}
      aria-hidden="true"
      className="pointer-events-none"
      style={{ minHeight }}
    >
      {fallback}
    </div>
  );
}
