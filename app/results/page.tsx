export const dynamic = "force-dynamic";

import Link from "next/link";
import SortSelect from "./SortSelect";
import ListingCard from "@/app/components/ListingCard";
import { supabaseAdmin } from "../lib/supabaseAdmin";

type SortKey = "price_asc" | "price_desc";
type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

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

type ListingRow = {
  id: string;
  title: string;
  city: string;
  price: number;
  available_from: string;
  available_to: string;
  status: string;
};

const META_BY_ID: Record<
  string,
  {
    distanceKm?: number;
    housingType?: string;
    furnished?: boolean;
    wifi?: boolean;
    imageUrl?: string | null;
  }
> = {
  // Beispiel-IDs: passe sie an deine echten IDs an, wenn sie anders sind
  "mannheim-1": {
    distanceKm: 0.8,
    housingType: "2-Zi-Wohnung",
    furnished: true,
    wifi: true,
    imageUrl: null,
  },
  "erlangen-1": {
    distanceKm: 1.2,
    housingType: "WG-Zimmer",
    furnished: true,
    wifi: true,
    imageUrl: null,
  },
  "koeln-1": {
    distanceKm: 2.4,
    housingType: "Studio",
    furnished: false,
    wifi: true,
    imageUrl: null,
  },
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);

  const city = pick(sp, "city");
  const from = pick(sp, "from");
  const to = pick(sp, "to");

  const sort = (pick(sp, "sort") || "price_asc") as SortKey;

  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  // 1) Published Inserate aus Supabase laden
  const { data, error } = await supabaseAdmin
    .from("listing_drafts")
    .select("id,title,city,price,available_from,available_to,email,status,created_at,housing_type,distance_km,furnished,wifi,kitchen,washing_machine,elevator,basement,image_url")
    .eq("status", "published");

  const rows: ListingRow[] = (data || []) as any;

  // 2) Filtern (Stadt + Zeitraum)
  const filtered = rows.filter((l) => {
    const cityOk = !city || l.city.toLowerCase().includes(city.toLowerCase());

    const aFrom = parseDate(l.available_from);
    const aTo = parseDate(l.available_to);

    // Inserat muss den gewünschten Zeitraum ABDECKEN
    const dateOk =
      (!fromDate || (aFrom && aFrom <= fromDate)) &&
      (!toDate || (aTo && aTo >= toDate));

    return cityOk && dateOk;
  });

  // 3) Sortieren
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_desc") return b.price - a.price;
    return a.price - b.price;
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

        {/* Sort UI */}
        <SortSelect city={city} from={from} to={to} sort={sort} />

        {/* Optional Debug bei Fehler */}
        {error && (
          <div className="mt-4 rounded-2xl border bg-white p-4 text-sm text-red-600">
            Fehler beim Laden: {error.message}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {sorted.map((l) => {
  const meta = META_BY_ID[l.id] || {};

  return (
    <ListingCard
      key={l.id}
      id={l.id}
      title={l.title}
      city={l.city}
      price={l.price}
      availableFrom={formatDate(l.available_from)}
      availableTo={formatDate(l.available_to)}
      href={`/listing/${l.id}?city=${encodeURIComponent(city)}&from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(to)}`}
      distanceKm={meta.distanceKm ?? null}
      housingType={meta.housingType ?? null}
      furnished={meta.furnished ?? null}
      wifi={meta.wifi ?? null}
      imageUrl={meta.imageUrl ?? null}
    />
  );
})}
</div>

        {sorted.length === 0 && (
          <p className="mt-6 text-sm text-slate-600">Keine Treffer für diesen Zeitraum.</p>
        )}
      </section>
    </main>
  );
}