import Link from "next/link";
import ListingCTA from "../../../app/components/ListingCTA";

type SP = Record<string, string | string[] | undefined>;

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);

  const city = (Array.isArray(sp.city) ? sp.city[0] : sp.city || "").trim();
  const from = (Array.isArray(sp.from) ? sp.from[0] : sp.from || "").trim();
  const to = (Array.isArray(sp.to) ? sp.to[0] : sp.to || "").trim();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <Link
            href="/results"
            className="text-sm text-slate-600 hover:text-black"
          >
            Zurück zu Treffern
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Inserat: <span className="text-slate-600">{params.id}</span>
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border bg-white p-5">
            <div className="h-44 rounded-xl bg-slate-100 mb-4 flex items-center justify-center text-slate-500 text-sm">
              Bild-Platzhalter
            </div>
            <h2 className="text-lg font-semibold">Details</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Nähe zur Klinik (Demo)</li>
              <li>• Möbliert (Demo)</li>
              <li>• WLAN (Demo)</li>
              <li>• Übergabe flexibel (Demo)</li>
            </ul>
          </div>

          <ListingCTA listingId={params.id} city={city} from={from} to={to} />
        </div>
      </section>
    </main>
  );
}