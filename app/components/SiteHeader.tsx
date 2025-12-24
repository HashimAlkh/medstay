import Link from "next/link";

type SiteHeaderProps = {
  rightLink?: { href: string; label: string };
};

export default function SiteHeader({ rightLink }: SiteHeaderProps) {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          med<span className="text-blue-600">stay</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/create-listing"
            className="text-sm font-medium text-slate-700 hover:text-black"
          >
            Inserat einstellen
          </Link>

          {rightLink && (
            <Link
              href={rightLink.href}
              className="text-sm text-slate-600 hover:text-black"
            >
              {rightLink.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}