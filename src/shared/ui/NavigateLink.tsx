type NavigateLink = {
  url: string;
  text: string;
  ariaLabel?: string;
  newTabHint?: string;
};

export function NavigateLink({ text, url, ariaLabel, newTabHint }: NavigateLink) {
  const computedAriaLabel = ariaLabel ?? (newTabHint ? `${text} (${newTabHint})` : text);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={computedAriaLabel}
      title={computedAriaLabel}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-border/70 bg-card/80 px-[clamp(1.25rem,2vw,2.25rem)] py-[clamp(0.8rem,1vw,1.15rem)] text-(length:--font-body-small) font-semibold transition hover:border-primary/60 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
    >
      <span className="font-semibold">{text}</span>
    </a>
  );
}
