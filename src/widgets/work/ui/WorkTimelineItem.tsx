import type { WorkItem } from "../model/types";

type WorkTimelineItemProps = {
  item: WorkItem;
  decisionLabel: string;
  impactLabel: string;
  evidenceLabel: string;
  stackLabel: string;
  currentLabel?: string;
};

export function WorkTimelineItem({
  item,
  decisionLabel,
  impactLabel,
  evidenceLabel,
  stackLabel,
  currentLabel,
}: WorkTimelineItemProps) {
  const titleId = `work-item-${item.id}-title`;
  const periodId = `work-item-${item.id}-period`;
  const contextId = `work-item-${item.id}-context`;

  return (
    <li
      key={item.id}
      data-work-card
      className="
        relative grid gap-[clamp(0.875rem,2vw,2rem)] pl-[clamp(2rem,4vw,3rem)]
        lg:grid-cols-[clamp(10rem,14vw,15rem)_minmax(0,1fr)] lg:pl-0
      "
    >
      <span
        aria-hidden="true"
        className="
          absolute left-[clamp(0.625rem,1vw,0.875rem)] top-[clamp(0.35rem,0.8vw,0.7rem)]
          h-[clamp(0.8rem,0.9vw,1.05rem)] w-[clamp(0.8rem,0.9vw,1.05rem)]
          -translate-x-1/2 rotate-45 rounded-[0.18rem] bg-primary
          ring-[0.45rem] ring-bg
          lg:left-[clamp(12rem,16vw,17rem)]
        "
      />

      <div className="pt-0.5 lg:pr-[clamp(1.5rem,2vw,2.5rem)]">
        <p
          id={periodId}
          className="font-mono text-(length:--font-body-small) leading-relaxed text-muted"
        >
          {item.period}
        </p>
        {currentLabel ? (
          <span
            className="
              mt-3 inline-flex rounded-full border border-primary/35 px-3 py-1
              text-(length:--font-eyebrow) font-medium leading-none text-primary
            "
          >
            {currentLabel}
          </span>
        ) : null}
      </div>

      <article
        aria-labelledby={titleId}
        aria-describedby={`${periodId} ${contextId}`}
        className="
          overflow-hidden rounded-[clamp(0.9rem,1.1vw,1rem)] border border-border/80
          bg-card/55 shadow-[0_8px_8px_-10px_rgba(18,22,28,0.42)]
        "
      >
        <div className="grid gap-[clamp(1rem,2vw,2rem)] p-[clamp(1rem,2.5vw,2.25rem)] xl:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.25fr)]">
          <header className="space-y-[clamp(0.75rem,1.4vw,1.25rem)]">
            <div className="space-y-2">
              <h3
                id={titleId}
                className="text-[clamp(1.35rem,1.8vw,2.25rem)] font-semibold leading-[1.04] text-balance"
              >
                {item.role}
              </h3>
              <p className="text-(length:--font-body-small) font-medium leading-relaxed text-fg">
                {item.company}
              </p>
            </div>

            <p
              id={contextId}
              className="max-w-[58ch] text-(length:--font-body-small) leading-relaxed text-muted text-pretty"
            >
              {item.context}
            </p>
          </header>

          <div className="grid gap-[clamp(1rem,1.8vw,1.5rem)]">
            <dl className="grid gap-[clamp(0.875rem,1.4vw,1.25rem)] md:grid-cols-2">
              <div className="space-y-2">
                <dt className="font-mono text-xxs font-medium leading-none text-primary">
                  {decisionLabel}
                </dt>
                <dd className="text-(length:--font-body-small) leading-relaxed text-fg text-pretty">
                  {item.decision}
                </dd>
              </div>

              <div className="space-y-2">
                <dt className="font-mono text-xxs font-medium leading-none text-primary">
                  {impactLabel}
                </dt>
                <dd className="text-(length:--font-body-small) leading-relaxed text-fg text-pretty">
                  {item.impact}
                </dd>
              </div>
            </dl>

            <div className="grid gap-[clamp(1rem,1.5vw,1.35rem)] border-t border-border/70 pt-[clamp(1rem,1.5vw,1.35rem)] md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.62fr)]">
              <div className="space-y-3">
                <h4 className="font-mono text-xxs font-medium leading-none text-muted">
                  {evidenceLabel}
                </h4>
                <ul className="space-y-2.5 text-(length:--font-body-small) leading-relaxed text-muted">
                  {item.evidence.map((evidence) => (
                    <li key={`${item.id}-${evidence}`} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80"
                      />
                      <span>{evidence}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-xxs font-medium leading-none text-muted">
                  {stackLabel}
                </h4>
                <ul className="flex flex-wrap gap-2" aria-label={stackLabel}>
                  {item.stack.map((stackItem) => (
                    <li
                      key={`${item.id}-${stackItem}`}
                      className="
                        rounded-full bg-primary/10 px-3 py-1.5
                        text-fg font-medium leading-none
                      "
                    >
                      {stackItem}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
