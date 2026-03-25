export const dynamic = "force-dynamic";
import SiteHeader from "app/components/SiteHeader";
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
  housing_type: string | null;
  furnished: string | null;
  image_url: string | null;
  equipment: {
    wifi?: boolean;
    washing_machine?: boolean;
    elevator?: boolean;
    parking?: boolean;
    bathroom_type?: string | null;
    kitchen_type?: string | null;
  } | null;
};

function isListingRow(x: unknown): x is ListingRow {
  const o = x as Record<string, unknown>;
  return (
    !!o &&
    typeof o === "object" &&
    typeof o.id === "string" &&
    o.id !== "" &&
    o.id !== "undefined" &&
    typeof o.title === "string" &&
    typeof o.city === "string" &&
    typeof o.price === "number" &&
    typeof o.available_from === "string" &&
    typeof o.available_to === "string"
  );
}

function housingTypeLabel(v: string | null) {
  if (v === "apartment") return "Ganze Wohnung";
  if (v === "room") return "Zimmer";
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

  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  const { data, error } = await supabaseAdmin
  .from("listings")
  .select(
    "id,title,city,price,available_from,available_to,housing_type,furnished,image_url,equipment"
  )
  .order("published_at", { ascending: false });

  // ✅ härter: nur Rows zulassen, die wirklich wie ListingRow aussehen
  const rows: ListingRow[] = Array.isArray(data)
    ? data.filter(isListingRow)
    : [];
    // ✅ DEBUG: Was kommt wirklich aus Supabase an?




// Harte Guard: Wenn hier schon undefined ist, ist das Problem VOR ListingCard.
if (rows.length > 0 && (!rows[0].id || rows[0].id === "undefined")) {
  console.log("🚨 rows[0] raw:", rows[0]);
}

  const filtered = rows.filter((l) => {
    const cityOk = !city || l.city.toLowerCase().includes(city.toLowerCase());

    const aFrom = parseDate(l.available_from);
    const aTo = parseDate(l.available_to);

    const dateOk =
      (!fromDate || (aFrom && aFrom <= fromDate)) &&
      (!toDate || (aTo && aTo >= toDate));

    return cityOk && dateOk;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_desc") return b.price - a.price;
    return a.price - b.price;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader/>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {city ? `Treffer in ${city}` : "Treffer"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Zeitraum: {from || "—"} – {to || "—"}
        </p>

        <SortSelect city={city} from={from} to={to} sort={sort} />

        {error && (
          <div className="mt-4 rounded-2xl border bg-white p-4 text-sm text-red-600">
            Fehler beim Laden: {error.message}
          </div>
        )}

        {/* ✅ Bonus: Wenn Supabase “komische” Rows lieferte, siehst du’s hier sofort */}
        {Array.isArray(data) && data.length !== rows.length ? (
          <div className="mt-4 rounded-2xl border bg-white p-4 text-sm text-amber-700">
            Hinweis: {data.length - rows.length} ungültige Datensätze wurden
            ausgefiltert (fehlende/ungültige ID).
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((l, idx) => {
  if (idx < 5) console.log("RENDER l.id:", l.id, "FULL:", l);
  return (
    <ListingCard
      key={l.id}
      id={l.id}
      title={l.title}
      city={l.city}
      price={l.price}
      availableFrom={formatDate(l.available_from)}
      availableTo={formatDate(l.available_to)}
      href={`/listing/${encodeURIComponent(l.id)}?source=results&city=${encodeURIComponent(
  city
)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
      furnished={l.furnished === "yes"}
wifi={l.equipment?.wifi ?? false}
      imageUrl={l.image_url}
    />
  );
})}
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