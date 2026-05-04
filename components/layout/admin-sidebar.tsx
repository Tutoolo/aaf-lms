"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Radio,
  ClipboardCheck,
  HelpCircle,
  GraduationCap,
  BarChart3,
  Library,
  Megaphone,
  Settings,
  Wrench,
  CreditCard,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: any;
  /** Roles that can see this nav item. Empty / undefined = everyone with admin access. */
  allowedRoles?: Role[];
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cohorts", label: "Cohorts", icon: GraduationCap },
  { href: "/admin/curriculum", label: "Curriculum Builder", icon: BookOpen },
  { href: "/admin/sessions", label: "Live Sessions", icon: Radio },
  { href: "/admin/assignments", label: "Assignments", icon: ClipboardCheck },
  { href: "/admin/quizzes", label: "Quizzes", icon: HelpCircle },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/library", label: "Library", icon: Library },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    allowedRoles: ["CHIEF_PROGRAM_COORDINATOR", "ADMIN", "DEVELOPER"],
  },
  {
    href: "/admin/payments",
    label: "Payments",
    icon: CreditCard,
    allowedRoles: ["CHIEF_PROGRAM_COORDINATOR", "ADMIN", "DEVELOPER"],
  },
  {
    href: "/admin/developer",
    label: "Developer",
    icon: Wrench,
    allowedRoles: ["ADMIN", "DEVELOPER"],
  },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const visibleNav = ADMIN_NAV.filter(
    (item) => !item.allowedRoles || (role && item.allowedRoles.includes(role)),
  );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-brown-warm/40 bg-brown-deep text-cream md:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-cream">Fellowship</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleNav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-gold text-brown-deep"
                  : "text-cream/80 hover:bg-brown-mid hover:text-cream",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-brown-warm/30 p-4 text-xs text-cream/60">
        {role ? `${role.replace(/_/g, " ").toLowerCase()} view` : "Admin view"}
      </div>
    </aside>
  );
}
