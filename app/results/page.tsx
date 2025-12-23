export const dynamic = "force-dynamic";

import Link from "next/link";
import SortSelect from "./SortSelect";

type SortKey = "price_asc" | "price_desc";

function parseDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Listing = {
  id: string;
  title: string;
  city: string;
  price: number;
  availableFrom: string;
  availableTo: string;
};

const LISTINGS: Listing[] = [
  {
    id: "mannheim-1",
    title: "2-Zi-Wohnung nahe Uniklinik",
    city: "Mannheim",
    price: 780,
    availableFrom: "2026-02-01",
    availableTo: "2026-04-30",
  },
  {
    id: "erlangen-1",
    title: "WG-Zimmer ruhig & zentral",
    city: "Erlangen",
    price: 520,
    availableFrom: "2026-01-15",
    availableTo: "2026-04-15",
  },
  {
    id: "koeln-1",
    title: "Studio-Apartment mit ÖPNV",
    city: "Köln",
    price: 830,
    availableFrom: "2026-03-01",
    availableTo: "2026-05-31",
  },
];

type SP = Record<string, string | string[] | undefined>;

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);

  const city = (Array.isArray(sp.city) ? sp.city[0] : sp.city || "").trim();
  const from = (Array.isArray(sp.from) ? sp.from[0] : sp.from || "").trim();
  const to = (Array.isArray(sp.to) ? sp.to[0] : sp.to || "").trim();

  const sort = ((Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) ||
    "price_asc") as SortKey;

  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  // 1) Filtern
  const filtered = LISTINGS.filter((l) => {
    const cityOk = !city || l.city.toLowerCase().includes(city.toLowerCase());

    const aFrom = parseDate(l.availableFrom);
    const aTo = parseDate(l.availableTo);

    // Treffer nur wenn Inserat den gesuchten Zeitraum vollständig ABDECKT
    const dateOk =
      (!fromDate || (aFrom && aFrom <= fromDate)) &&
      (!toDate || (aTo && aTo >= toDate));

    return cityOk && dateOk;
  });

  // 2) Sortieren
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_desc") return b.price - a.price;
    return a.price - b.price; // price_asc
  });

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
        <h1 className="text-2xl font-semibold tracking-tight">
          {city ? `Treffer in ${city}` : "Treffer"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Zeitraum: {from || "—"} – {to || "—"}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Debug: city="{city || "-"}", from="{from || "-"}", to="{to || "-"}",
          sort="{sort}"
        </p>

        {/* Sort UI */}
        <SortSelect city={city} from={from} to={to} sort={sort} />

        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((l) => (
            <div key={l.id} className="rounded-2xl border bg-white p-4">
              <div className="text-sm text-slate-500">{l.city}</div>
              <div className="font-semibold">{l.title}</div>
              <div className="mt-2 text-sm text-slate-600">
                verfügbar {formatDate(l.availableFrom)} –{" "}
                {formatDate(l.availableTo)}
              </div>
              <div className="mt-2 font-semibold">{l.price} € / Monat</div>
            </div>
          ))}
        </div>

        {sorted.length === 0 && (
          <p className="mt-6 text-sm text-slate-600">
            Keine Treffer für diesen Zeitraum.
          </p>
        )}
      </section>
    </main>
  );
}