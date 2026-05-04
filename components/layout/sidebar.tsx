"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  GraduationCap,
  BookOpen,
  Radio,
  Library,
  ClipboardCheck,
  HelpCircle,
  Code2,
  MessageSquare,
  TrendingUp,
  Award,
  Bell,
  Settings,
  Trophy,
} from "lucide-react";

export const STUDENT_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/cohort", label: "My Cohort", icon: GraduationCap },
  { href: "/dashboard/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/dashboard/live", label: "Live Classroom", icon: Radio },
  { href: "/dashboard/library", label: "Library", icon: Library },
  { href: "/dashboard/assignments", label: "Assignments", icon: ClipboardCheck },
  { href: "/dashboard/quizzes", label: "Quizzes & Exams", icon: HelpCircle },
  { href: "/dashboard/sandbox", label: "My Sandbox", icon: Code2 },
  { href: "/dashboard/community", label: "Community", icon: MessageSquare },
  { href: "/dashboard/progress", label: "Progress Report", icon: TrendingUp },
  { href: "/dashboard/badges", label: "Badges", icon: Trophy },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function StudentSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-brown-warm/40 bg-brown-deep text-cream md:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="font-display text-lg font-semibold text-cream">
          The Fellowship
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {STUDENT_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
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
        Founding Cohort · Week 4 of 10
      </div>
    </aside>
  );
}
