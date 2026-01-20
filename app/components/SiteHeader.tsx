import Link from "next/link";

type SiteHeaderProps = {
  rightLink?: { href: string; label: string };
  sticky?: boolean;

  /**
   * default: normaler Header inkl. "Inserat einstellen"
   * flow: für Create/Preview Flow → ohne "Inserat einstellen"
   */
  mode?: "default" | "flow";
};

export default function SiteHeader({
  rightLink,
  sticky,
  mode = "default",
}: SiteHeaderProps) {
  return (
    <header
      className={`w-full bg-white shadow-md ${sticky ? "sticky top-0 z-10" : ""}`}
    >
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            med<span className="text-teal-600">stay</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {mode !== "flow" && (
            <Link
              href="/create-listing"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
            >
              Inserat einstellen
            </Link>
          )}

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