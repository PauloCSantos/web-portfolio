import { AnimatedSwitch } from "@shared/ui/AnimatedSwitch";
import type { MenuViewProps } from "./MenuView.types";

type MenuSwitchGroupProps = Pick<
  MenuViewProps,
  | "isDarkTheme"
  | "onToggleTheme"
  | "themeLabels"
  | "isEnglish"
  | "onToggleLanguage"
  | "langLabels"
> & {
  tone: "light" | "dark";
  className?: string;
  switchClassName?: string;
  switchContentClassName?: string;
};

export function MenuSwitchGroup({
  tone,
  isDarkTheme,
  onToggleTheme,
  themeLabels,
  isEnglish,
  onToggleLanguage,
  langLabels,
  className,
  switchClassName,
  switchContentClassName,
}: MenuSwitchGroupProps) {
  return (
    <div className={className}>
      <AnimatedSwitch
        className={switchClassName}
        contentClassName={switchContentClassName}
        tone={tone}
        checked={isDarkTheme}
        onChange={onToggleTheme}
        leftLabel={themeLabels.left}
        rightLabel={themeLabels.right}
        ariaLabel={themeLabels.aria}
      />

      <AnimatedSwitch
        className={switchClassName}
        contentClassName={switchContentClassName}
        tone={tone}
        checked={isEnglish}
        onChange={onToggleLanguage}
        leftLabel={langLabels.left}
        rightLabel={langLabels.right}
        ariaLabel={langLabels.aria}
      />
    </div>
  );
}
