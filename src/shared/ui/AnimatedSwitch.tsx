import { type KeyboardEvent } from "react";
import { cn } from "../lib/tailwind";

type Props = {
  checked: boolean;
  onChange: () => void;
  leftLabel?: string;
  rightLabel?: string;
  ariaLabel: string;
  tone?: "light" | "dark";
  className?: string;
  contentClassName?: string;
};

export function AnimatedSwitch({
  checked,
  onChange,
  leftLabel,
  rightLabel,
  ariaLabel,
  tone = "light",
  className,
  contentClassName,
}: Props) {
  const isDark = tone === "dark";

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange();
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      onKeyDown={handleKeyDown}
      className={cn(
        "select-none",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
    >
      <span
        className={cn(
          "grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 xl:gap-2",
          "min-w-24 xl:min-w-28",
          contentClassName,
        )}
      >
        <span
          className={cn(
            "text-[0.62rem] text-right uppercase tracking-[0.12em] transition-opacity whitespace-nowrap xl:text-xxs xl:tracking-xwide",
            checked ? "opacity-50" : "opacity-100",
          )}
        >
          {leftLabel ?? ""}
        </span>

        <span
          className={cn(
            "relative flex items-center",
            "h-6 w-10 rounded-full",
            "border transition-colors",
            isDark ? "bg-white/10 border-white/20" : "bg-black/10 border-black/20",
          )}
          aria-hidden="true"
        >
          <span
            className={cn(
              "absolute top-0.5",
              "h-5 w-5 rounded-full",
              "shadow-switch bg-white",
              "transition-transform duration-300 ease-out",
              checked ? "translate-x-4" : "translate-x-0",
            )}
          />
        </span>

        <span
          className={cn(
            "text-[0.62rem] text-left uppercase tracking-[0.12em] transition-opacity whitespace-nowrap xl:text-xxs xl:tracking-xwide",
            checked ? "opacity-100" : "opacity-50",
          )}
        >
          {rightLabel ?? ""}
        </span>
      </span>
    </button>
  );
}
