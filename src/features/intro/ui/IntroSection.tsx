import { useCallback, useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import { LineTextSignature } from "./LineTextSignature";
import { useTranslation } from "react-i18next";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";

type Props = {
  onFinish?: () => void;
  onExit?: () => void;
  readyToFinish?: boolean;
};

export function IntroSection(props: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const readyToFinish = props.readyToFinish ?? true;
  const { t } = useTranslation("intro");
  const titleId = useId();
  const descriptionId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const onDone = props.onFinish ?? props.onExit ?? null;

  const hasFinishedRef = useRef(false);
  const pendingFinishRef = useRef(false);
  const skipButtonRef = useRef<HTMLButtonElement | null>(null);

  const finishOnce = useCallback(() => {
    if (hasFinishedRef.current) return;
    if (!readyToFinish) {
      pendingFinishRef.current = true;
      return;
    }

    hasFinishedRef.current = true;
    const root = rootRef.current;
    if (!root || reduceMotion) {
      onDone?.();
      return;
    }

    gsap.to(root, {
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.98,
      duration: 0.45,
      ease: "power1.inOut",
      onComplete: () => onDone?.(),
    });
  }, [onDone, readyToFinish, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) finishOnce();
  }, [reduceMotion, finishOnce]);

  useEffect(() => {
    if (!readyToFinish || !pendingFinishRef.current) return;

    pendingFinishRef.current = false;
    finishOnce();
  }, [finishOnce, readyToFinish]);

  useEffect(() => {
    if (reduceMotion) return;
    skipButtonRef.current?.focus();
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <h2 id={titleId} className="sr-only">
        {t("title")}
      </h2>

      <p id={descriptionId} className="sr-only">
        {t("description")} {t("signatureText")}
      </p>

      <button
        ref={skipButtonRef}
        type="button"
        disabled={!readyToFinish}
        aria-busy={!readyToFinish}
        onClick={finishOnce}
        className="absolute right-(--layout-gutter) top-3 rounded-full bg-bg/80 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-fg transition-opacity disabled:pointer-events-none disabled:opacity-45 sm:top-4 sm:px-4 sm:py-2 sm:text-(length:--font-eyebrow) sm:tracking-xwide
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                   focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {t("skip")}
      </button>

      <div className="full-viewport flex items-center justify-center px-(--layout-gutter) py-[clamp(2rem,5vw,5rem)]">
        <LineTextSignature
          className="w-full"
          text={t("signatureText")}
          rows={34}
          fontWeight={900}
          duration={reduceMotion ? 0 : 5}
          onComplete={finishOnce}
        />
      </div>
    </div>
  );
}
