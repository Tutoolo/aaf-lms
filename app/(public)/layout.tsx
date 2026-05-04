import Link from "next/link";
import { PublicMobileMenu } from "@/components/layout/public-mobile-menu";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 border-b border-cream-mid bg-cream/85 backdrop-blur">
        <nav className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold text-brown-deep md:text-xl">
              The Fellowship
            </span>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-gold sm:inline">
              Platform
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/curriculum" className="text-sm text-brown-deep hover:text-gold transition-colors">Curriculum</Link>
            <Link href="/#pricing" className="text-sm text-brown-deep hover:text-gold transition-colors">Pricing</Link>
            <Link href="/demo" className="text-sm text-brown-deep hover:text-gold transition-colors">Demo Day</Link>
            <Link href="/login" className="text-sm text-brown-deep hover:text-gold transition-colors">Sign in</Link>
            <Link
              href="/apply"
              className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-brown-deep hover:bg-gold-light transition-colors"
            >
              Apply
            </Link>
          </div>

          {/* Mobile: always-visible Apply + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/apply"
              className="rounded-md bg-gold px-3 py-1.5 text-sm font-medium text-brown-deep hover:bg-gold-light"
            >
              Apply
            </Link>
            <PublicMobileMenu />
          </div>
        </nav>
      </header>
      {children}
      <footer className="mt-32 border-t border-cream-mid bg-brown-deep text-cream">
        <div className="container py-16">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="font-display text-2xl font-semibold text-cream">The Fellowship Platform</h3>
              <p className="mt-3 max-w-md text-sm text-cream/70">
                A 10-week cohort program for African and diaspora learners
                building production-grade AI agents.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-gold">Program</h4>
              <ul className="mt-3 space-y-2 text-sm text-cream/80">
                <li><Link href="/curriculum" className="hover:text-gold">Curriculum</Link></li>
                <li><Link href="/#pricing" className="hover:text-gold">Pricing</Link></li>
                <li><Link href="/apply" className="hover:text-gold">Apply</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-gold">Account</h4>
              <ul className="mt-3 space-y-2 text-sm text-cream/80">
                <li><Link href="/login" className="hover:text-gold">Sign in</Link></li>
                <li><Link href="/register" className="hover:text-gold">Create account</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-cream/10 pt-6 text-xs text-cream/60">
            © {new Date().getFullYear()} The Fellowship Platform · Built for African builders.
          </div>
        </div>
      </footer>
    </div>
  );
}
