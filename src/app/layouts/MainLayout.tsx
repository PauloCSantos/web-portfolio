import type { ReactNode, ComponentType } from "react";

type ShellProps = { children: ReactNode };
type ShellComponent = ComponentType<ShellProps>;

type MainLayoutProps = {
  children: ReactNode;
  Shell?: ShellComponent;
};

const DefaultShell: ShellComponent = ({ children }) => <>{children}</>;

export function MainLayout({ children, Shell = DefaultShell }: MainLayoutProps) {
  return <Shell>{children}</Shell>;
}
