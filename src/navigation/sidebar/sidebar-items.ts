import {
  Briefcase,
  CalendarDays,
  ChartBar,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Compass,
  FileBarChart,
  FolderOpen,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  type LucideIcon,
  Network,
  Settings,
  Target,
  TrendingUp,
  UserSearch,
  Users,
  Wallet,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Workforce",
    items: [
      {
        id: "employees",
        title: "Employees",
        url: "/dashboard/employees",
        icon: Users,
      },
      {
        id: "departments",
        title: "Departments",
        url: "/dashboard/departments",
        icon: Briefcase,
      },
      {
        id: "organization",
        title: "Organization",
        url: "/dashboard/organization",
        icon: Network,
      },
    ],
  },
  {
    id: 3,
    label: "Talent Acquisition",
    items: [
      {
        id: "recruitment",
        title: "Recruitment",
        url: "/dashboard/recruitment",
        icon: UserSearch,
      },
      {
        id: "candidates",
        title: "Candidates",
        url: "/dashboard/candidates",
        icon: Users,
      },
      {
        id: "positions",
        title: "Job Positions",
        url: "/dashboard/positions",
        icon: ClipboardList,
      },
      {
        id: "onboarding",
        title: "Onboarding",
        url: "/dashboard/onboarding",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    id: 4,
    label: "Time & Attendance",
    items: [
      {
        id: "attendance",
        title: "Attendance",
        url: "/dashboard/attendance",
        icon: Clock,
      },
      {
        id: "leave",
        title: "Leave Management",
        url: "/dashboard/leave",
        icon: CalendarDays,
      },
    ],
  },
  {
    id: 5,
    label: "Performance & Growth",
    items: [
      {
        id: "performance",
        title: "Performance",
        url: "/dashboard/performance",
        icon: TrendingUp,
      },
      {
        id: "goals",
        title: "Goals",
        url: "/dashboard/goals",
        icon: Target,
      },
      {
        id: "training",
        title: "Training",
        url: "/dashboard/training",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: 6,
    label: "Compensation & Benefits",
    items: [
      {
        id: "documents",
        title: "Documents",
        url: "/dashboard/documents",
        icon: FolderOpen,
      },
      {
        id: "compensation",
        title: "Compensation",
        url: "/dashboard/compensation",
        icon: Wallet,
      },
      {
        id: "benefits",
        title: "Benefits",
        url: "/dashboard/benefits",
        icon: HeartHandshake,
      },
    ],
  },
  {
    id: 7,
    label: "Planning & Insights",
    items: [
      {
        id: "workforce-planning",
        title: "Workforce Planning",
        url: "/dashboard/workforce-planning",
        icon: Compass,
      },
      {
        id: "reports",
        title: "Reports",
        url: "/dashboard/reports",
        icon: FileBarChart,
      },
      {
        id: "analytics",
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: ChartBar,
      },
    ],
  },
  {
    id: 8,
    label: "System",
    items: [
      {
        id: "settings",
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
