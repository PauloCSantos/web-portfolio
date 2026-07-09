import type { EducationItem } from "../model/types";

type EducationCardProps = {
  item: EducationItem;
  degreeLabel: string;
  institutionLabel: string;
  periodLabel: string;
  focusLabel: string;
  proofLabel: string;
  index: number;
};

export function EducationCard({
  item,
  degreeLabel,
  institutionLabel,
  periodLabel,
  focusLabel,
  proofLabel,
  index,
}: EducationCardProps) {
  const titleId = `education-item-${item.id}-title`;
  const proofListId = `education-item-${item.id}-proof`;
  const sequence = String(index + 1).padStart(2, "0");

  return (
    <li
      data-education-item
      className="group relative grid gap-5 border-t border-border/80 py-7 first:border-t-0 first:pt-0 md:grid-cols-[minmax(7rem,0.34fr)_minmax(0,1fr)] md:gap-8 md:py-9"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary/70 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out group-hover:scale-x-100"
      />

      <div className="grid content-start gap-3 text-(length:--font-body-small)">
        <div className="flex items-baseline justify-between gap-4 md:block">
          <dl>
            <dt className="sr-only">{periodLabel}</dt>
            <dd className="font-(family-name:--font-mono) text-xxs leading-none text-primary">
              {item.status}
            </dd>
          </dl>
          <span
            aria-hidden="true"
            className="font-(family-name:--font-display) text-5xl leading-none text-fg/10 md:mt-5 md:block md:text-7xl"
          >
            {sequence}
          </span>
        </div>

        <dl>
          <dt className="sr-only">{degreeLabel}</dt>
          <dd className="max-w-48 text-fg">{item.degree}</dd>
        </dl>
      </div>

      <article aria-labelledby={titleId} className="grid gap-5">
        <header className="grid gap-2">
          <p className="text-(length:--font-body-small) leading-relaxed text-muted">
            <span className="sr-only">{institutionLabel}: </span>
            {item.institution}
          </p>
          <h3
            id={titleId}
            className="max-w-[18ch] text-[clamp(1.45rem,2.2vw,2.7rem)] font-semibold leading-[1.02] text-balance"
          >
            {item.course}
          </h3>
        </header>

        <dl className="grid gap-2">
          <dt className="sr-only">{focusLabel}</dt>
          <dd className="max-w-[68ch] text-(length:--font-body-fluid) leading-relaxed text-fg text-pretty">
            {item.emphasis}
          </dd>
        </dl>

        <div
          className="grid gap-3 border-l border-primary/40 pl-4 sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-5 sm:border-l-0 sm:pl-0"
          aria-labelledby={proofListId}
        >
          <p
            id={proofListId}
            className="font-(family-name:--font-mono) text-xxs leading-5 text-primary"
          >
            {proofLabel}
          </p>
          <ul className="grid gap-2 text-(length:--font-body-small) leading-relaxed text-muted">
            {item.proofPoints.map((point) => (
              <li
                key={point}
                className="relative pl-4 before:absolute before:left-0 before:top-[0.72em] before:size-1 before:rounded-full before:bg-primary"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </li>
  );
}
