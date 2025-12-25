import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";

type SP = Record<string, string | string[] | undefined>;

function pick(sp: SP, key: string) {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v || "").toString().trim();
}

function formatGermanDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "—";
  return `${d}.${m}.${y}`;
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);

  const title = pick(sp, "title");
  const city = pick(sp, "city");
  const price = pick(sp, "price");
  const from = pick(sp, "from");
  const to = pick(sp, "to");
  const description = pick(sp, "description");
  const email = pick(sp, "email");

  const qs = new URLSearchParams({
  title,
  city,
  price,
  from,
  to,
  description,
  email,
}).toString();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader rightLink={{ href: "/create-listing/form", label: "Zurück" }} />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Vorschau</h1>
        <p className="mt-2 text-slate-600">
          Prüfen Sie Ihr Inserat. Wenn alles passt, geht es zur Bezahlung.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6">
          <div className="text-sm text-slate-500">{city || "—"}</div>
          <div className="mt-1 text-xl font-semibold">{title || "—"}</div>

          <div className="mt-3 text-sm text-slate-700">
            <span className="font-medium">Zeitraum:</span>{" "}
            {formatGermanDate(from)} – {formatGermanDate(to)}
          </div>

          <div className="mt-2 text-sm text-slate-700">
            <span className="font-medium">Preis:</span> {price ? `${price} € / Monat` : "—"}
          </div>

          <div className="mt-4 text-sm text-slate-700 whitespace-pre-wrap">
            {description || "—"}
          </div>

          <div className="mt-4 text-sm text-slate-700">
            <span className="font-medium">Kontakt:</span> {email || "—"}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-6">
          <div className="text-sm text-slate-500">Nächster Schritt</div>
          <div className="mt-1 text-2xl font-semibold">19 €</div>
          <p className="mt-2 text-sm text-slate-600">
            (MVP) Zahlung & Veröffentlichung hängen wir als nächsten Schritt dran.
          </p>

          <Link
  href={`/create-listing/pay?${qs}`}
  className="mt-5 block w-full text-center rounded-xl bg-blue-600 text-white py-3 text-sm font-medium hover:bg-blue-700"
>
  Zur Bezahlung (19 €)
</Link>

          <div className="mt-4 text-center">
            <Link
              href="/create-listing/form"
              className="text-sm text-slate-600 hover:text-black"
            >
              Angaben bearbeiten
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}