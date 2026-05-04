"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut, ArrowLeftRight, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STAFF_ROLES = [
  "INSTRUCTOR",
  "COHORT_COORDINATOR",
  "CHIEF_PROGRAM_COORDINATOR",
  "ADMIN",
  "DEVELOPER",
];

export function TopBar({
  children,
  mobileMenu,
}: {
  children?: React.ReactNode;
  /** Slot for the mobile hamburger + drawer (rendered only on mobile). */
  mobileMenu?: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname() ?? "";
  const user = session?.user;
  const isStaff = user?.role ? STAFF_ROLES.includes(user.role) : false;
  const isOnAdmin = pathname.startsWith("/admin");

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="flex h-16 items-center justify-between border-b border-cream-mid bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {mobileMenu}
        <div className="truncate font-display text-base text-brown-deep md:text-lg">
          {children}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {/* Staff-only view switch — icon-only on small screens */}
        {isStaff && (
          <Link
            href={isOnAdmin ? "/dashboard" : "/admin"}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold-pale px-2 py-1.5 text-xs font-medium text-brown-deep transition-colors hover:bg-gold/20 md:px-3"
            title={isOnAdmin ? "View what students see" : "Open the admin console"}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span className="hidden md:inline">
              {isOnAdmin ? "Student view" : "Admin view"}
            </span>
          </Link>
        )}

        {/* Public site link — desktop only */}
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1.5 text-xs text-muted hover:text-gold lg:inline-flex"
          title="Open public site in a new tab"
        >
          Public site <ExternalLink className="h-3 w-3" />
        </Link>

        <button
          className="relative rounded-full p-2 hover:bg-cream-mid"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-brown-deep" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-terra" />
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ""} />
            <AvatarFallback>{initials ?? "?"}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col text-right md:flex">
            <span className="text-sm font-medium text-brown-deep">{user?.name}</span>
            <span className="text-xs text-muted">{user?.role?.toLowerCase()}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted hover:bg-cream-mid hover:text-brown-deep"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
