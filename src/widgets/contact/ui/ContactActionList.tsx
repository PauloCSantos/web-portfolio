import { ResumeButton } from "@features/resume";
import type { SocialLinks } from "@entities/profile";

type ContactActionListProps = {
  links?: SocialLinks;
  linkedinLabel: string;
  linkedinDescription: string;
  githubLabel: string;
  githubDescription: string;
  resumeDescription: string;
  newTabHint: string;
  ariaLabel: string;
};

type ContactLinkProps = {
  url: string;
  label: string;
  description: string;
  newTabHint: string;
};

function ContactLink({ url, label, description, newTabHint }: ContactLinkProps) {
  const computedAriaLabel = `${label} (${newTabHint})`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={computedAriaLabel}
      title={computedAriaLabel}
      className="group flex min-h-20 w-full items-center justify-between gap-5 border-t border-border/75 py-4 text-left transition-colors hover:border-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <span className="min-w-0 space-y-1">
        <span className="block text-(length:--font-body-small) font-semibold text-fg">
          {label}
        </span>
        <span className="block text-[0.82rem] leading-relaxed text-muted text-pretty">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full border border-border/80 text-primary transition group-hover:border-primary/70 group-hover:bg-primary group-hover:text-white"
      >
        ↗
      </span>
    </a>
  );
}

export function ContactActionList({
  links,
  linkedinLabel,
  linkedinDescription,
  githubLabel,
  githubDescription,
  resumeDescription,
  newTabHint,
  ariaLabel,
}: ContactActionListProps) {
  const { linkedin, github } = links ?? {};

  return (
    <ul aria-label={ariaLabel} className="flex w-full list-none flex-col p-0">
      {linkedin ? (
        <li>
          <ContactLink
            url={linkedin}
            label={linkedinLabel}
            description={linkedinDescription}
            newTabHint={newTabHint}
          />
        </li>
      ) : null}

      {github ? (
        <li>
          <ContactLink
            url={github}
            label={githubLabel}
            description={githubDescription}
            newTabHint={newTabHint}
          />
        </li>
      ) : null}

      <li className="space-y-3 border-t border-border/75 pt-5">
        <p className="text-[0.82rem] leading-relaxed text-muted text-pretty">
          {resumeDescription}
        </p>
        <ResumeButton className="w-full sm:w-full" />
      </li>
    </ul>
  );
}
