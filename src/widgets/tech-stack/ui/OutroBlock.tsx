type OutroBlockProps = {
  eyebrow: string;
  title: string;
  body: string;
  visible?: boolean;
};

export function OutroBlock({ eyebrow, title, body, visible = true }: OutroBlockProps) {
  return (
    <div
      className="tech-stack-copy tech-stack-outro"
      data-story-outro
      aria-hidden={!visible}
    >
      <p className="tech-stack-copy-kicker text-xs font-semibold uppercase tracking-[0.34em] text-fg/58 md:text-[clamp(0.75rem,0.78vw,0.8rem)]">
        {eyebrow}
      </p>
      <h3 className="tech-stack-copy-title max-w-full text-[clamp(2rem,3.2vw,3.6rem)] font-semibold leading-[1.02] text-balance text-fg">
        {title}
      </h3>
      <p className="tech-stack-copy-body max-w-full text-sm leading-7 text-fg/76 sm:text-base md:text-[clamp(1rem,1.05vw,1.08rem)]">
        {body}
      </p>
    </div>
  );
}
