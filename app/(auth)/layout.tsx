import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-cream-mid">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-xl font-semibold text-brown-deep">
            The Fellowship Platform
          </Link>
          <Link
            href="/"
            className="text-sm text-muted hover:text-brown-deep transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
