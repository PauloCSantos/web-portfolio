import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { FocusTarget } from "@shared/lib/focus/FocusTargets";
import { useRegisterFocusTarget } from "@shared/lib/focus/focus";
import { canUseDOM } from "@shared/lib/dom/canUseDOM";
import { getFocusable } from "./menuDom";
import type { MenuViewLabels } from "../ui/MenuView.types";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

export function useMenuViewState(labels: MenuViewLabels) {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (!canUseDOM) {
      return false;
    }

    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
  });

  const panelId = useId();
  const titleId = useId();
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const isScrolledRef = useRef(false);
  const menuStartRef = useRegisterFocusTarget(FocusTarget.MenuStart);

  const portalRoot = useMemo(() => {
    if (!canUseDOM) {
      return null;
    }

    return document.body;
  }, []);

  useEffect(() => {
    if (!open || !canUseDOM) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!canUseDOM) {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const syncDesktopState = (matches: boolean) => {
      setIsDesktop(matches);

      if (matches) {
        setOpen(false);
      }
    };

    syncDesktopState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncDesktopState(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!canUseDOM) {
      return;
    }

    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 8;

      if (isScrolledRef.current === nextIsScrolled) {
        return;
      }

      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!open || !canUseDOM) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !canUseDOM) {
      return;
    }

    const openerElement = openerRef.current;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    if (dialog) {
      const focusableElements = getFocusable(dialog);
      (focusableElements[0] ?? dialog).focus();
    }

    return () => {
      if (openerElement?.focus) {
        openerElement.focus();
        return;
      }

      previousActiveElement?.focus?.();
    };
  }, [open]);

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const focusableElements = getFocusable(dialog);

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (
        !activeElement ||
        activeElement === firstFocusable ||
        !dialog.contains(activeElement)
      ) {
        event.preventDefault();
        lastFocusable.focus();
      }

      return;
    }

    if (
      !activeElement ||
      activeElement === lastFocusable ||
      !dialog.contains(activeElement)
    ) {
      event.preventDefault();
      firstFocusable.focus();
    }
  };

  const headerAriaLabel = labels.title;

  return {
    open,
    setOpen,
    isScrolled,
    isDesktop,
    panelId,
    titleId,
    openerRef,
    dialogRef,
    menuStartRef,
    portalRoot,
    onDialogKeyDown,
    headerAriaLabel,
  };
}
