"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Radio, Code2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bottom tab bar for the student dashboard on mobile. Shows the 5 most-used
 * destinations. Hidden on `md+` because the desktop sidebar covers nav there.
 */
const TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/dashboard/live", label: "Live", icon: Radio },
  { href: "/dashboard/sandbox", label: "Sandbox", icon: Code2 },
  { href: "/dashboard/badges", label: "Badges", icon: Trophy },
];

export function StudentMobileTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-brown-warm/40 bg-brown-deep text-cream md:hidden"
      aria-label="Mobile navigation"
    >
      {TABS.map((t) => {
        const active =
          pathname === t.href ||
          (t.href !== "/dashboard" && pathname.startsWith(t.href));
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
              active ? "text-gold" : "text-cream/70 hover:text-cream",
            )}
          >
            <Icon className="h-5 w-5" />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
