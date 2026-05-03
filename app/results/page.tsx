export const dynamic = "force-dynamic";

import SiteHeader from "app/components/SiteHeader";
import SortSelect from "./SortSelect";
import ListingCard from "@/app/components/ListingCard";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { Search } from "lucide-react";

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
  rooms: number | null;
  size_sqm: number | null;
  available_from: string;
  available_to: string;
  housing_type: string | null;
  image_url: string | null;
  equipment: {
    wifi?: boolean;
    washing_machine?: boolean;
    parking?: boolean;
  } | null;
};

function isListingRow(x: unknown): x is ListingRow {
  const o = x as Record<string, unknown>;
  return (
    !!o &&
    typeof o === "object" &&
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.city === "string" &&
    typeof o.price === "number" &&
    typeof o.available_from === "string" &&
    typeof o.available_to === "string"
  );
}

function housingTypeLabel(v: string | null) {
  if (v === "apartment") return "Wohnung";
  if (v === "room") return "WG";
  return null;
}

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

  const maxPrice = Number(pick(sp, "max_price") || 0) || null;
  const minRooms = Number(pick(sp, "min_rooms") || 0) || null;
  const minSize = Number(pick(sp, "min_size") || 0) || null;
  const housingType = pick(sp, "housing_type");

  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  const { data, error } = await supabaseAdmin
    .from("listings")
    .select(
      "id,title,city,price,rooms,size_sqm,available_from,available_to,housing_type,image_url,equipment"
    )
    .order("published_at", { ascending: false });

  const rows: ListingRow[] = Array.isArray(data) ? data.filter(isListingRow) : [];

  const filtered = rows.filter((l) => {
    const cityOk = !city || l.city.toLowerCase().includes(city.toLowerCase());

    const aFrom = parseDate(l.available_from);
    const aTo = parseDate(l.available_to);

    const dateOk =
      (!fromDate || (aFrom && aFrom <= fromDate)) &&
      (!toDate || (aTo && aTo >= toDate));

    const priceOk = !maxPrice || l.price <= maxPrice;
    const roomsOk = !minRooms || (l.rooms !== null && l.rooms >= minRooms);
    const sizeOk = !minSize || (l.size_sqm !== null && l.size_sqm >= minSize);
    const typeOk = !housingType || l.housing_type === housingType;

    return cityOk && dateOk && priceOk && roomsOk && sizeOk && typeOk;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_desc") return b.price - a.price;
    return a.price - b.price;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex items-center justify-between">
  <h1 className="text-2xl font-semibold tracking-tight">
    {city ? `Treffer in ${city}` : "Treffer"}
  </h1>

<a
  href={`/?city=${encodeURIComponent(city)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
  className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100 hover:border-teal-300 transition"
>
  <Search className="h-4 w-4" />
  Neue Suche
</a>
</div>

        <p className="mt-2 text-sm text-slate-600">
  Zeitraum: {from || "—"} – {to || "—"}
</p>



        <SortSelect
  city={city}
  from={from}
  to={to}
  sort={sort}
/>

        {error && (
          <div className="mt-4 rounded-2xl border bg-white p-4 text-sm text-red-600">
            Fehler beim Laden: {error.message}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((l) => (
            <ListingCard
              key={l.id}
              id={l.id}
              title={l.title}
              city={l.city}
              price={l.price}
              rooms={l.rooms}
              sizeSqm={l.size_sqm}
              availableFrom={formatDate(l.available_from)}
              availableTo={formatDate(l.available_to)}
              href={`/listing/${encodeURIComponent(l.id)}?source=results`}
              housingType={housingTypeLabel(l.housing_type)}
              wifi={l.equipment?.wifi ?? false}
              parking={l.equipment?.parking ?? false}
              imageUrl={l.image_url}
            />
          ))}
        </div>

        {sorted.length === 0 && (
          <p className="mt-6 text-sm text-slate-600">
            Keine Treffer für diese Filter.
          </p>
        )}
      </section>
    </main>
  );
}