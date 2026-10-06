import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Route, ListTree, PlayCircle, ClipboardList, FileText,
  Boxes, Award, Users, Briefcase, Settings, LifeBuoy,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  locked?: boolean;
  /** Shown on mobile's bottom bar. */
  primary?: boolean;
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    label: "Learn",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, primary: true },
      { href: "/journey", label: "My Journey", icon: Route, primary: true },
      { href: "/curriculum", label: "Curriculum", icon: ListTree, primary: true },
      { href: "/videos", label: "Videos", icon: PlayCircle },
      { href: "/assignments", label: "Assignments", icon: ClipboardList },
      { href: "/notes", label: "Notes", icon: FileText },
      { href: "/projects", label: "Projects", icon: Boxes, primary: true },
    ],
  },
  {
    label: "Beyond the programme",
    items: [
      { href: "/certification", label: "Certification", icon: Award },
      { href: "/community", label: "Community", icon: Users },
      { href: "/jobs", label: "Job Portal", icon: Briefcase, locked: true },
    ],
  },
  {
    label: null,
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/help", label: "Help", icon: LifeBuoy },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV.flatMap((g) => g.items);
