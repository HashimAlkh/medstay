import Link from "next/link";

type SiteHeaderProps = {
  rightLink?: { href: string; label: string };
  sticky?: boolean;
};

export default function SiteHeader({ rightLink, sticky }: SiteHeaderProps) {
  return (
    <header
      className={[
        "w-full bg-white/90 backdrop-blur",
        "border-b border-slate-200",
        sticky ? "sticky top-0 z-50" : "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-bold tracking-tight text-slate-900">
            med<span className="text-teal-600">stay</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* statt “Button” nur cleanes Text-CTA */}
          <Link
            href="/create-listing"
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 transition px-2 py-1 rounded-lg hover:bg-teal-50"
          >
            Inserat einstellen
          </Link>

          {rightLink && (
            <Link
              href={rightLink.href}
              className="text-sm text-slate-600 hover:text-slate-900 transition"
            >
              {rightLink.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}