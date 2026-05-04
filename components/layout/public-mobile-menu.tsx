"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/demo", label: "Demo Day" },
  { href: "/login", label: "Sign in" },
];

export function PublicMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md p-2 text-brown-deep hover:bg-cream-mid md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop — high z-index so it sits above the sticky header */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden
      />

      {/* Drawer — explicit height + above the backdrop */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-[110] flex h-screen w-72 max-w-[85vw] flex-col border-l border-cream-mid bg-cream shadow-2xl transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-cream-mid bg-cream px-5">
          <span className="font-display text-lg font-semibold text-brown-deep">
            The Fellowship
          </span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-2 text-brown-deep hover:bg-cream-mid"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto bg-cream p-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex rounded-md px-3 py-3 text-sm font-medium text-brown-deep hover:bg-cream-mid"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="mt-4 flex items-center justify-center rounded-md bg-gold px-4 py-3 text-sm font-medium text-brown-deep hover:bg-gold-light"
          >
            Apply for next cohort
          </Link>
        </nav>
      </aside>
    </>
  );
}
