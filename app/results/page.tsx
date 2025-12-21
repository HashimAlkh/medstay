import Link from "next/link";

function formatGermanDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
}

type Listing = {
  id: string;
  title: string;
  city: string;
  price: number;
  distanceMin: number;
  availableFrom: string;
  availableTo: string;
};

const MOCK: Listing[] = [
  { id: "duesseldorf-01", title: "Helles Zimmer nahe Uniklinik", city: "Düsseldorf", price: 590, distanceMin: 12, availableFrom: "2026-01-01", availableTo: "2026-03-31" },
  { id: "mannheim-01", title: "2-Zi. Wohnung – ideal fürs PJ", city: "Mannheim", price: 780, distanceMin: 9, availableFrom: "2026-02-01", availableTo: "2026-04-30" },
  { id: "erlangen-01", title: "WG-Zimmer, ruhig & zentral", city: "Erlangen", price: 520, distanceMin: 15, availableFrom: "2026-01-15", availableTo: "2026-04-15" },
  { id: "koeln-01", title: "Studio-Apartment, ÖPNV top", city: "Köln", price: 830, distanceMin: 18, availableFrom: "2026-03-01", availableTo: "2026-05-31" },
  { id: "muenchen-01", title: "Kompakt & modern, Nähe Klinik", city: "München", price: 980, distanceMin: 14, availableFrom: "2026-01-01", availableTo: "2026-06-30" },
  { id: "hamburg-01", title: "Zimmer in Med-WG, gute Lage", city: "Hamburg", price: 640, distanceMin: 11, availableFrom: "2026-02-15", availableTo: "2026-05-15" },
];

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { city?: string; from?: string; to?: string };
}) {
  const city = (searchParams.city || "").trim();
  const from = searchParams.from || "";
  const to = searchParams.to || "";

  const filtered = MOCK.filter((l) => {
    const cityOk = !city || l.city.toLowerCase().includes(city.toLowerCase());
    // simple demo logic: ignore date filtering for now
    return cityOk;
  });

  const headerCity = city ? `Treffer in ${city}` : "Treffer";
  const dateLine =
    from || to
      ? `${from ? formatGermanDate(from) : "—"} – ${to ? formatGermanDate(to) : "—"}`
      : "";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            med<span className="text-blue-600">stay</span>
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-black">
            Neue Suche
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">{headerCity}</h1>
        {dateLine ? <p className="text-sm text-slate-600 mt-1">{dateLine}</p> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((l) => (
            <Link
              key={l.id}
              href={`/listing/${l.id}`}
              className="block rounded-2xl border bg-white p-4 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{l.city}</div>
                  <div className="text-base font-semibold">{l.title}</div>
                  <div className="mt-2 text-sm text-slate-600">
                    {l.distanceMin} Min zur Klinik · verfügbar {formatGermanDate(l.availableFrom)} –{" "}
                    {formatGermanDate(l.availableTo)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold">{l.price} €</div>
                  <div className="text-xs text-slate-500">pro Monat</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-slate-600">
            Keine Treffer. Versuch eine andere Stadt.
          </p>
        ) : null}
      </section>
    </main>
  );
}