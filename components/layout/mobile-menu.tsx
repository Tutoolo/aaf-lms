"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type MobileNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Mobile drawer navigation. Renders a hamburger button (visible only below
 * the `md` breakpoint) that opens a left-side drawer with the provided nav
 * items. Drawer auto-closes when the route changes or the user taps outside.
 */
export function MobileMenu({
  items,
  brand,
  brandSub,
  footer,
}: {
  items: MobileNavItem[];
  brand: string;
  brandSub?: string;
  footer?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer when navigation occurs
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md p-2 hover:bg-cream-mid md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5 text-brown-deep" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-[110] flex h-screen w-72 max-w-[85vw] flex-col border-r border-brown-warm/40 bg-brown-deep text-cream shadow-2xl transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between bg-brown-deep px-5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold text-cream">{brand}</span>
            {brandSub && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                {brandSub}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-2 hover:bg-brown-mid"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-cream" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto bg-brown-deep px-3 py-2">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
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
        {footer && (
          <div className="shrink-0 border-t border-brown-warm/30 p-4 text-xs text-cream/60">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}
