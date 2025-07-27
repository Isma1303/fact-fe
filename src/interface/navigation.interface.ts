import type { ReactNode } from "react";

export interface CustomNavigationItem {
  segment: string;
  title: string;
  icon: ReactNode;
  onClick: () => void;
}
