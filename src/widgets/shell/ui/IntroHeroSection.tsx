import {
  lazy,
  startTransition,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { IntroSection } from "@features/intro";
import { FocusTarget } from "@shared/lib/focus/FocusTargets";
import { useFocus } from "@shared/lib/focus/focus";
import { useTranslation } from "react-i18next";
import { usePrefersReducedMotion } from "@shared/lib/motion/usePrefersReducedMotion";
import { IntroTransitionProvider } from "@shared/lib/motion/IntroTransitionContext";

const Menu = lazy(async () => {
  const module = await import("@features/menu");
  return { default: module.Menu };
});

type DeferredMenuProps = {
  onReady: () => void;
};

function DeferredMenu({ onReady }: DeferredMenuProps) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return <Menu />;
}

type IntroAppSectionProps = PropsWithChildren;
type IntroPhase = "preparing" | "intro" | "revealing" | "ready";
type IdleCallbackWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export function IntroAppSection({ children }: IntroAppSectionProps) {
  const [phase, setPhase] = useState<IntroPhase>("preparing");
  const [deferredContentReady, setDeferredContentReady] = useState(false);
  const appContentRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { focus } = useFocus();
  const { t } = useTranslation("common");
  const appPrepared = phase !== "preparing";
  const introComplete = phase === "revealing" || phase === "ready";
  const appInteractive = phase === "ready";

  const handleIntroComplete = () => {
    setPhase("revealing");
  };

  const focusMenuStart = useCallback(() => {
    const frameId = requestAnimationFrame(() => {
      focus(FocusTarget.MenuStart);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [focus]);

  useEffect(() => {
    if (appPrepared) return;

    const prepareApp = () => {
      setPhase((currentPhase) => (currentPhase === "preparing" ? "intro" : currentPhase));
    };

    if (typeof window === "undefined") {
      prepareApp();
      return;
    }

    const idleWindow = window as IdleCallbackWindow;

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(prepareApp, { timeout: 1200 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = globalThis.setTimeout(prepareApp, 300);
    return () => globalThis.clearTimeout(timeoutId);
  }, [appPrepared]);

  useLayoutEffect(() => {
    if (introComplete || typeof window === "undefined") return;

    const { document, history } = window;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    const previousTouchAction = document.body.style.touchAction;
    const previousScrollRestoration = history.scrollRestoration;

    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      document.body.style.touchAction = previousTouchAction;
      history.scrollRestoration = previousScrollRestoration;
      window.scrollTo(0, 0);
    };
  }, [introComplete]);

  useEffect(() => {
    if (!appInteractive || deferredContentReady) {
      return;
    }

    const revealDeferredContent = () => {
      startTransition(() => {
        setDeferredContentReady(true);
      });
    };

    if (typeof window === "undefined") {
      revealDeferredContent();
      return;
    }

    const idleWindow = window as IdleCallbackWindow;

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(revealDeferredContent, {
        timeout: 700,
      });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = globalThis.setTimeout(revealDeferredContent, 120);
    return () => globalThis.clearTimeout(timeoutId);
  }, [appInteractive, deferredContentReady]);

  useGSAP(
    () => {
      const content = appContentRef.current;

      if (!content || !appPrepared) {
        return undefined;
      }

      if (phase === "intro") {
        gsap.set(content, {
          autoAlpha: 0,
          pointerEvents: "none",
        });
        return undefined;
      }

      const cleanupLayoutStyles = () => {
        gsap.set(content, {
          pointerEvents: "auto",
          clearProps: "opacity,visibility,willChange",
        });

        setPhase("ready");
      };

      if (phase === "ready") {
        gsap.set(content, {
          pointerEvents: "auto",
          clearProps: "opacity,visibility,willChange",
        });
        return undefined;
      }

      const completeReveal = () => {
        cleanupLayoutStyles();
      };

      if (reduceMotion) {
        gsap.set(content, {
          autoAlpha: 1,
        });

        completeReveal();
        return undefined;
      }

      gsap.fromTo(
        content,
        {
          autoAlpha: 0,
          willChange: "opacity",
        },
        {
          autoAlpha: 1,
          duration: 0.32,
          ease: "power2.out",
          onComplete: completeReveal,
        },
      );

      return undefined;
    },
    {
      dependencies: [appPrepared, phase, reduceMotion],
      scope: appContentRef,
    },
  );

  return (
    <div className="full-viewport">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-md focus:bg-bg focus:px-4 focus:py-2 focus:text-fg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg"
      >
        {t("menu.skipToContent")}
      </a>
      <main
        id="main"
        className="app-shell relative full-viewport overflow-x-hidden overflow-y-visible"
      >
        {!introComplete ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <IntroSection readyToFinish={appPrepared} onFinish={handleIntroComplete} />
          </div>
        ) : null}

        {appPrepared && (
          <IntroTransitionProvider
            heroRevealEnabled={introComplete}
            deferredContentReady={deferredContentReady}
          >
            <div
              ref={appContentRef}
              aria-hidden={!appInteractive}
              style={{
                opacity: appInteractive ? undefined : 0,
                pointerEvents: appInteractive ? "auto" : "none",
              }}
            >
              {deferredContentReady ? (
                <Suspense fallback={null}>
                  <DeferredMenu onReady={focusMenuStart} />
                </Suspense>
              ) : null}
              {children}
            </div>
          </IntroTransitionProvider>
        )}
      </main>
    </div>
  );
}
